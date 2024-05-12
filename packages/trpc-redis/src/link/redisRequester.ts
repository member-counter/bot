import type { DataTransformer } from "@trpc/core";
import type { Redis } from "ioredis";

import type { RequestMessage, ResponseMessage } from "../schemas";
import { REQ_CHANNEL, RES_CHANNEL } from "../Constants";
import { responseMessageSchema } from "../schemas";

type PendingRequests = Map<
  string,
  {
    resolve: (response: ResponseMessage) => void;
    reject: (error: Error) => void;
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

  redisSubClient.on("message", (_channel, message) => {
    try {
      let responseMessage = responseMessageSchema.parse(JSON.parse(message));

      const pendingRequest = pendingRequests.get(responseMessage.id);
      if (!pendingRequest) return;
      pendingRequests.delete(responseMessage.id);

      if (responseMessage.type === "error") {
        responseMessage = {
          ...responseMessage,
          error: transformer.deserialize(responseMessage.error),
        };
      } else {
        responseMessage = {
          ...responseMessage,
          result: transformer.deserialize(responseMessage.result),
        };
      }

      pendingRequest.resolve(responseMessage);
    } catch (err) {
      console.error("Error while handling incoming message", err);
    }
  });

  const waitForResponse = (requestMessage: RequestMessage) => {
    return new Promise<ResponseMessage>((resolve, reject) => {
      setTimeout(() => {
        reject(
          new Error(`Request timed out: ${JSON.stringify(requestMessage)}`),
        );
        pendingRequests.delete(requestMessage.id);
      }, requestTimeout);

      pendingRequests.set(requestMessage.id, { resolve, reject });
    });
  };

  const redisRequest = async (requestMessage: RequestMessage) => {
    const serializedInput = transformer.serialize(
      requestMessage.input,
    ) as unknown;

    requestMessage = {
      ...requestMessage,
      input: serializedInput,
    };

    await redisPubClient.publish(REQ_CHANNEL, JSON.stringify(requestMessage));

    return await waitForResponse(requestMessage);
  };

  return { pendingRequests, redisRequest };
};
