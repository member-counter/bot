import type { Lock } from "@sesamecare-oss/redlock";
import type {
  AnyTRPCRouter,
  CreateContextCallback,
  inferRouterContext,
} from "@trpc/server";
import type {
  ErrorHandlerOptions,
  MaybePromise,
} from "@trpc/server/unstable-core-do-not-import";
import type { Redis } from "ioredis";
import { Redlock } from "@sesamecare-oss/redlock";
import {
  callTRPCProcedure,
  getErrorShape,
  getTRPCErrorFromUnknown,
  TRPCError,
} from "@trpc/server";

import type { RequestMessage, ResponseMessage } from "../schemas";
import { REQ_CHANNEL, RES_CHANNEL } from "../Constants";
import { requestMessageSchema } from "../schemas";
import { resumeOtelTracing } from "./resumeOtelTracing";

class DropRequestError extends Error {}

export interface CreateRedisContextFnOpts {
  requestId: string;
  takeRequest: (take: boolean) => Promise<void>;
}

export type CreateRedisContextFn<TRouter extends AnyTRPCRouter> = (
  opts: CreateRedisContextFnOpts,
) => MaybePromise<inferRouterContext<TRouter>>;

export type RedisHandlerOptions<TRouter extends AnyTRPCRouter> = {
  redisPubClient: Redis;
  redisSubClient: Redis;
  router: TRouter;
  onError?: (opts: ErrorHandlerOptions<inferRouterContext<TRouter>>) => void;
} & CreateContextCallback<
  inferRouterContext<TRouter>,
  CreateRedisContextFn<TRouter>
>;

export async function redisHandler<TRouter extends AnyTRPCRouter>(
  opts: RedisHandlerOptions<TRouter>,
) {
  const { redisPubClient, redisSubClient, router, createContext, onError } =
    opts;
  const redLock = new Redlock([redisPubClient], { retryCount: 0 });

  const { deserialize, serialize } = router._def._config.transformer.output;

  const publishResponse = async (responseMessage: ResponseMessage) => {
    if (responseMessage.type === "error") {
      responseMessage = {
        ...responseMessage,
        error: serialize(responseMessage.error),
      };
    } else if (responseMessage.type === "result") {
      responseMessage = {
        ...responseMessage,
        result: serialize(responseMessage.result),
      };
    }

    await redisPubClient.publish(RES_CHANNEL, JSON.stringify(responseMessage));
  };

  const makeTakeRequest = (requestMessage: RequestMessage) => {
    let takeDecided = false;
    let lock: Lock | undefined = undefined;
    let interval: NodeJS.Timeout;

    const takeRequest = async (take: boolean) => {
      if (takeDecided) {
        return;
      }

      takeDecided = true;

      if (!take) {
        throw new DropRequestError();
      }

      const lockKey = `lock:${RES_CHANNEL}:${requestMessage.id}`;

      lock = await redLock
        .acquire([lockKey], 3000, {
          retryCount: 0,
        })
        .catch(() => {
          throw new DropRequestError();
        });

      await publishResponse({
        id: requestMessage.id,
        type: "heartbeat",
      });

      interval = setInterval(() => {
        void lock
          ?.extend(3000)
          .then((newLock) => {
            lock = newLock;
            void publishResponse({
              id: requestMessage.id,
              type: "heartbeat",
            });
          })
          .catch(() => {
            clearInterval(interval);
          });
      }, 3000 / 2);
    };

    const requestDone = async () => {
      clearInterval(interval);
      await lock?.release();
    };

    return {
      takeRequest,
      requestDone,
    };
  };

  const executeProcedure = async (
    ctx: inferRouterContext<TRouter>,
    requestMessage: RequestMessage,
  ) => {
    const { path, type, input } = requestMessage;

    if (type === "subscription") {
      throw new TRPCError({
        code: "METHOD_NOT_SUPPORTED",
        message: "Subscriptions are not supported",
      });
    }

    const deserializedInput = deserialize(input) as unknown;

    return (await callTRPCProcedure({
      router,
      type,
      path,
      ctx,
      getRawInput: () => Promise.resolve(deserializedInput),
      signal: undefined,
    })) as unknown;
  };

  const handleRequest = (rawMessage: string) => {
    let requestMessage: RequestMessage;

    try {
      requestMessage = requestMessageSchema.parse(JSON.parse(rawMessage));
    } catch (err) {
      onError?.({
        error: new TRPCError({ code: "PARSE_ERROR", cause: err }),
        ctx: undefined,
        type: "unknown",
        input: undefined,
        path: undefined,
      });
      return;
    }

    const { input, path, type, traceId, spanId, id } = requestMessage;

    void resumeOtelTracing(traceId, spanId, async () => {
      const { takeRequest, requestDone } = makeTakeRequest(requestMessage);

      const ctx = await createContext?.({
        requestId: requestMessage.id,
        takeRequest: takeRequest,
      });

      try {
        const result = await executeProcedure(ctx, requestMessage);

        await publishResponse({ id, type: "result", result });
      } catch (err) {
        const error = getTRPCErrorFromUnknown(err);

        if (error.cause instanceof DropRequestError) {
          return;
        }

        onError?.({ error, ctx, input, path, type });

        void publishResponse({
          id,
          type: "error",
          error: getErrorShape({
            config: router._def._config,
            error,
            type,
            path,
            input,
            ctx,
          }),
        });
      } finally {
        await requestDone();
      }
    });
  };

  redisSubClient.on("message", (channel, message) => {
    if (channel !== REQ_CHANNEL) return;
    void handleRequest(message);
  });

  await redisSubClient.subscribe(REQ_CHANNEL);
}
