import { randomUUID } from "crypto";
import type { TRPCLink } from "@trpc/client";
import type { AnyTRPCRouter } from "@trpc/server";
import { TRPCClientError } from "@trpc/client";
import { observable } from "@trpc/server/observable";

import type { RedisRequesterOptions } from "./redisRequester";
import { setupRedisRequester } from "./redisRequester";

export const redisLink = async <TRouter extends AnyTRPCRouter>(
  opts: RedisRequesterOptions,
): Promise<TRPCLink<TRouter>> => {
  const { redisRequest, pendingRequests } = await setupRedisRequester(opts);

  return () =>
    ({ op }) =>
      observable((observer) => {
        const { type, path, input } = op;
        const id = randomUUID();

        redisRequest({ id, type, path, input })
          .then((res) => {
            if (res.type === "error") {
              observer.error(TRPCClientError.from({ error: res.error }));
              return;
            }

            observer.next({
              result: {
                data: res.result,
              },
            });

            observer.complete();
          })
          .catch((cause) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            observer.error(TRPCClientError.from(cause));
          });

        return () => {
          pendingRequests.delete(id);
        };
      });
};
