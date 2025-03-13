import { botPermissions } from "@mc/common/bot/botPermissions";
import { EventHandler } from "@mc/common/bot/structures/EventHandler";
import { generateInviteLink } from "@mc/common/generateInviteLink";

export const readyEvent = new EventHandler({
  name: "ready",
  handler: async (client) => {
    const { logger } = client.botInstanceOptions;

    logger.info("Bot ready");
    logger.info(`Logged in as ${client.user.tag}`);
    logger.info(
      `Invite link: ${generateInviteLink({ clientId: client.user.id, permissions: botPermissions })}`,
    );

    if (
      client.botInstanceOptions.isPremium &&
      client.botInstanceOptions.isPrivileged
    ) {
      logger.info("Requesting members");
      for (const guild of client.guilds.cache.values()) {
        await guild.members.fetch({ withPresences: true });
      }
      logger.info("Members received");
    }
  },
});
