import { createServer } from "node:http";
import { proxyRequests } from "@discordjs/proxy";
import { REST, RESTEvents } from "@discordjs/rest";

import logger from "@mc/logger";

import { env } from "./env";

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", { promise, reason });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", { error });
});

// Discord's global REST limit (~50 req/s) applies per token but discord.js
// enforces it per process, so processes sharing one token overrun it and hit
// silent 429 waits. Run one proxy per shared token, co-located with its bot
// processes, and point their DISCORD_BOT_INSTANCE_REST_PROXY_URL here: every
// request then flows through this single rate limiter, which queues instead
// of erroring, and the whole budget goes to whichever process needs it.
const rest = new REST({
  // surface progress towards Discord's ban threshold (10k invalid responses
  // per 10 minutes per IP) instead of finding out when the IP gets blocked
  invalidRequestWarningInterval: 500,
}).setToken(env.DISCORD_BOT_INSTANCE_TOKEN);

// A global hit means the token's whole budget is exhausted — the very thing
// this proxy exists to prevent; per-route limits are routine Discord behavior
rest.on(RESTEvents.RateLimited, (info) => {
  const message = `Rate limited on ${info.method} ${info.route} (scope: ${info.scope}), resets in ${info.timeToReset}ms`;

  if (info.global) logger.warn(`GLOBAL: ${message}`);
  else logger.debug(message);
});

rest.on(RESTEvents.InvalidRequestWarning, ({ count, remainingTime }) => {
  logger.warn(
    `${count} invalid requests in the current 10 minute window (${remainingTime}ms remaining); Discord blocks the IP at 10k`,
  );
});

rest.on(RESTEvents.Debug, (message) => logger.debug(message));

// Requests queue at the rate limiter; clients abort at @discordjs/rest's
// default 15s timeout, so waits near that mean the budget is saturated
const SLOW_REQUEST_MS = 10_000;

// proxyRequests rethrows anything that isn't a recognized Discord error
// (e.g. a network hiccup); answer 502 instead of crashing the shared proxy
const handleRequest = proxyRequests(rest);
const server = createServer((req, res) => {
  const startedAt = Date.now();

  void Promise.resolve(handleRequest(req, res))
    .then(() => {
      const duration = Date.now() - startedAt;

      if (duration > SLOW_REQUEST_MS) {
        logger.warn(
          `Slow proxied request: ${req.method} ${req.url} took ${duration}ms — REST budget is saturated and clients abort at 15s`,
        );
      } else {
        logger.debug(
          `${req.method} ${req.url} ${res.statusCode} ${duration}ms`,
        );
      }
    })
    .catch((error: unknown) => {
      logger.error("Failed to proxy request", { error });
      if (!res.headersSent) res.statusCode = 502;
      res.end();
    });
});

server.listen(env.REST_PROXY_PORT, () => {
  logger.info(`Discord REST proxy listening on port ${env.REST_PROXY_PORT}`);
});
