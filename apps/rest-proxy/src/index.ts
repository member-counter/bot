import { createServer } from "node:http";
import { proxyRequests } from "@discordjs/proxy";
import { REST } from "@discordjs/rest";

import logger from "@mc/logger";

import { env } from "./env";

// Discord's global REST limit (~50 req/s) applies per token but discord.js
// enforces it per process, so processes sharing one token overrun it and hit
// silent 429 waits. Run one proxy per shared token, co-located with its bot
// processes, and point their DISCORD_BOT_INSTANCE_REST_PROXY_URL here: every
// request then flows through this single rate limiter, which queues instead
// of erroring, and the whole budget goes to whichever process needs it.
const rest = new REST().setToken(env.DISCORD_BOT_INSTANCE_TOKEN);

// proxyRequests rethrows anything that isn't a recognized Discord error
// (e.g. a network hiccup); answer 502 instead of crashing the shared proxy
const handleRequest = proxyRequests(rest);
const server = createServer((req, res) => {
  void Promise.resolve(handleRequest(req, res)).catch((error: unknown) => {
    logger.error("Failed to proxy request", { error });
    if (!res.headersSent) res.statusCode = 502;
    res.end();
  });
});

server.listen(env.REST_PROXY_PORT, () => {
  logger.info(`Discord REST proxy listening on port ${env.REST_PROXY_PORT}`);
});
