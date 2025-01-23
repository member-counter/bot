import { ObjectId } from "mongodb";
import { z } from "zod";

export const oldDonationSchemaValidator = z.object({
  _id: z.instanceof(ObjectId),
  user: z.string(),
  note: z.string().optional().default(""),
  anonymous: z.boolean().optional().default(false),
  amount: z.number(),
  currency: z.string(),
  date: z.date(),
});

export const oldGuildSettingsSchema = z.object({
  _id: z.instanceof(ObjectId),
  id: z.string(),
  counters: z.record(z.string(), z.string()).default({}),
  shortNumber: z.number().default(1),
  locale: z.string().default("disabled"),
  digits: z
    .array(z.union([z.string(), z.null(), z.undefined()]))
    .default(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]),
  blocked: z.boolean().default(false),
});
