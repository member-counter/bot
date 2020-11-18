import Bot from "../client";

// TODO
const setStatus = () => {
  Bot.client.editStatus('online', {
    name: `${DISCORD_PREFIX}help`,
    type: 3,
  });
};
