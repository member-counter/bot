import type { SpanContext } from "@opentelemetry/api";
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
import { context, trace, TraceFlags } from "@opentelemetry/api";
import {
  callTRPCProcedure,
  getErrorShape,
  getTRPCErrorFromUnknown,
  TRPCError,
} from "@trpc/server";

import type { RequestMessage, ResponseMessage } from "../schemas";
import { REQ_CHANNEL, RES_CHANNEL } from "../Constants";
import { requestMessageSchema } from "../schemas";

interface CreateRedisContextFnOpts {
  requestId: string;
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

  const { deserialize, serialize } = router._def._config.transformer.output;

  const resolve = async (
    ctx: (typeof opts)["createContext"],
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

    const result = (await callTRPCProcedure({
      router,
      type,
      path,
      ctx,
      getRawInput: () => Promise.resolve(deserializedInput),
      signal: undefined,
    })) as unknown;

    return result;
  };

  const respond = async (responseMessage: ResponseMessage) => {
    if (responseMessage.type === "error") {
      responseMessage = {
        ...responseMessage,
        error: serialize(responseMessage.error),
      };
    } else {
      responseMessage = {
        ...responseMessage,
        result: serialize(responseMessage.result),
      };
    }

    await redisPubClient.publish(RES_CHANNEL, JSON.stringify(responseMessage));
  };

  const handleRequest = async (message: string) => {
    let ctx = await createContext?.({ requestId: "unknown" });

    let requestMessage: RequestMessage;
    try {
      requestMessage = requestMessageSchema.parse(JSON.parse(message));
      ctx = await createContext?.({
        requestId: requestMessage.id,
      });
    } catch (err) {
      onError?.({
        error: new TRPCError({ code: "PARSE_ERROR", cause: err }),
        ctx,
        type: "unknown",
        input: undefined,
        path: undefined,
      });
      return;
    }

    const { input, path, type, traceId, spanId } = requestMessage;

    const spanContext: SpanContext = {
      traceId,
      spanId,
      isRemote: true,
      traceFlags: TraceFlags.SAMPLED,
    };

    const remoteContext = trace.setSpanContext(context.active(), spanContext);

    void context.with(remoteContext, async () => {
      try {
        try {
          await respond({
            id: requestMessage.id,
            type: "result",
            result: await resolve(ctx, requestMessage),
          });
        } catch (err) {
          const error = getTRPCErrorFromUnknown(err);
          onError?.({ error, ctx, input, path, type });

          await respond({
            id: requestMessage.id,
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
        }
      } catch (err) {
        const error = getTRPCErrorFromUnknown(err);
        onError?.({ error, ctx, input, path, type });
      }
    });
  };

  await redisSubClient.subscribe(REQ_CHANNEL);

  redisSubClient.on("message", (channel, message) => {
    if (channel !== REQ_CHANNEL) return;
    void handleRequest(message);
  });
}
