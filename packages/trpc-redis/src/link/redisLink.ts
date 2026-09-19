import { randomUUID } from "crypto";
import type { TRPCClientError, TRPCLink } from "@trpc/client";
import type { AnyTRPCRouter } from "@trpc/server";
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

        void redisRequest({ id, type, path, input })
          .then((res) => {
            observer.next({
              result: {
                data: res,
              },
            });

            observer.complete();
          })
          .catch((cause: TRPCClientError<TRouter>) => {
            observer.error(cause);
          });

        return () => {
          pendingRequests.delete(id);
        };
      });
};
