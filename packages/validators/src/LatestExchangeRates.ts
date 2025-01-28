import { z } from "zod";

export const LatestExchangeRatesSchema = z.object({
  success: z.boolean(),
  timestamp: z.number(),
  base: z.string(),
  date: z.string(),
  rates: z.record(z.string(), z.number()),
});
