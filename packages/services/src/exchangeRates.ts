import assert from "assert";
import { setTimeout as sleep } from "timers/promises";
import { Redlock } from "@sesamecare-oss/redlock";

import logger from "@mc/logger";
import { redis } from "@mc/redis";
import { LatestExchangeRatesSchema } from "@mc/validators/LatestExchangeRates";

import { env } from "../env";

if (!env.OPENEXCHANGERATESORG_KEY) {
  logger.warn("OPENEXCHANGERATESORG_KEY is not set, all rates will be x1");
}

const fromBaseUrl = (pathname: string) => {
  assert(env.OPENEXCHANGERATESORG_KEY, "OPENEXCHANGERATESORG_KEY is not set");

  const url = new URL("https://openexchangerates.org/api");

  url.pathname = pathname;

  url.searchParams.set("app_id", env.OPENEXCHANGERATESORG_KEY);
  url.searchParams.set("show_alternative", "true");

  return url;
};

const successCodes = [200];
const statusHandler = (response: Response) => {
  if (!successCodes.includes(response.status))
    throw new Error("Unsuccessful openexchangerates.org response", {
      cause: response,
    });
  return response;
};

const CACHED_RATES_KEY = "exchange-rates";
const FETCH_RATES_LOCK_KEY = "fetch-exchange-rates-lock";
const RATE_LIMIT = 100; // per month, free max is 1000
const CACHE_LIFETIME = Math.floor((31 * 24 * 60 * 60) / RATE_LIMIT); // Cache lifetime in seconds

const get = (pathname: string) =>
  fetch(fromBaseUrl(pathname), {
    headers: { Accept: "application/json" },
  })
    .then(statusHandler)
    .then((res) => res.json());

export const ExchangeRateService = {
  getRates: async (): Promise<Record<string, number> | null> => {
    const rates = await redis.get(CACHED_RATES_KEY);

    if (!env.OPENEXCHANGERATESORG_KEY) {
      return null;
    }

    if (rates) {
      return LatestExchangeRatesSchema.parse(JSON.parse(rates)).rates;
    }

    const redlock = new Redlock([redis], { retryCount: 0 });

    try {
      const lock = await redlock.acquire([FETCH_RATES_LOCK_KEY], 5 * 60 * 1000);

      try {
        const unparsedRates = await get("/latest.json");

        const parsedRates = LatestExchangeRatesSchema.parse(unparsedRates);

        await redis.set(
          CACHED_RATES_KEY,
          JSON.stringify(parsedRates),
          "EX",
          CACHE_LIFETIME,
        );

        return parsedRates.rates;
      } catch (e) {
        logger.error("Failed to fetch exchange rates", { cause: e });
        throw e;
      } finally {
        await lock.release();
      }
    } catch {
      // maybe there is another request pending, lets try again in a few seconds
      await sleep(1000);
      return await ExchangeRateService.getRates();
    }
  },

  convert(amount: number, to: string, rates: Record<string, number> | null) {
    if (!rates) return amount;
    if (!rates[to]) return amount;
    else return amount * rates[to];
  },
};
