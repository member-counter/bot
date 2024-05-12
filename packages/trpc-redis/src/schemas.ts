import { z } from "zod";

export type RequestMessage = z.infer<typeof requestMessageSchema>;
export const requestMessageSchema = z.object({
  id: z.string(),
  type: z.enum(["query", "mutation", "subscription"]),
  path: z.string(),
  input: z.unknown(),
});

export type ResponseMessage = z.infer<typeof responseMessageSchema>;

export const responseMessageSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string(),
    type: z.literal("result"),
    result: z.unknown(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("error"),
    error: z.unknown(),
  }),
]);
