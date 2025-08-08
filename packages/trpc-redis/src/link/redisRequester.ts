import type { DataTransformer } from "@trpc/server/unstable-core-do-not-import";
import type { Redis } from "ioredis";

import type { RequestMessage } from "../schemas";
import { REQ_CHANNEL, RES_CHANNEL } from "../Constants";
import { responseMessageSchema } from "../schemas";

type PendingRequests = Map<
  string,
  {
    resolve: (response: unknown) => void;
    reject: (error: unknown) => void;
    extendTimeout: () => void;
    timeout: NodeJS.Timeout;
  }
>;

export interface RedisRequesterOptions {
  redisSubClient: Redis;
  redisPubClient: Redis;
  transformer: DataTransformer;
  requestTimeout?: number;
}

export const setupRedisRequester = async ({
  redisSubClient,
  redisPubClient,
  transformer,
  requestTimeout = 5000,
}: RedisRequesterOptions) => {
  const pendingRequests: PendingRequests = new Map();

  await redisSubClient.subscribe(RES_CHANNEL);

  redisSubClient.on("message", (channel, message) => {
    if (channel !== RES_CHANNEL) return;

    try {
      const responseMessage = responseMessageSchema.parse(JSON.parse(message));

      const pendingRequest = pendingRequests.get(responseMessage.id);
      if (!pendingRequest) return;

      if (responseMessage.type === "error") {
        pendingRequests.delete(responseMessage.id);
        pendingRequest.reject(transformer.deserialize(responseMessage.error));
      } else if (responseMessage.type === "result") {
        pendingRequests.delete(responseMessage.id);
        pendingRequest.resolve(transformer.deserialize(responseMessage.result));
      } else {
        pendingRequest.extendTimeout();
      }
    } catch (err) {
      console.error("Error while handling incoming message", err);
    }
  });

  const waitForResponse = (requestMessage: RequestMessage) => {
    return new Promise<unknown>((resolve, reject) => {
      pendingRequests.set(requestMessage.id, {
        resolve,
        reject,
        extendTimeout: () => {
          const pendingRequest = pendingRequests.get(requestMessage.id);
          if (!pendingRequest) return;
          clearTimeout(pendingRequest.timeout);
          pendingRequest.timeout = newTimeout(requestMessage, reject);
        },
        timeout: newTimeout(requestMessage, reject),
      });
    });
  };

  const newTimeout = (
    requestMessage: RequestMessage,
    reject: (error: unknown) => void,
  ) =>
    setTimeout(() => {
      reject(new Error(`Request timed out`, { cause: requestMessage }));
    }, requestTimeout);

  const redisRequest = async (requestMessage: RequestMessage) => {
    const serializedInput = transformer.serialize(
      requestMessage.input,
    ) as unknown;

    requestMessage = { ...requestMessage, input: serializedInput };

    await redisPubClient.publish(REQ_CHANNEL, JSON.stringify(requestMessage));

    return await waitForResponse(requestMessage);
  };

  return { pendingRequests, redisRequest };
};
