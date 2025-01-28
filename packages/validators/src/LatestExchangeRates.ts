import { z } from "zod";

export const LatestExchangeRatesSchema = z.object({
  timestamp: z.number(),
  base: z.string(),
  rates: z.record(z.string(), z.number()),
});
