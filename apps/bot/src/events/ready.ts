import { botPermissions } from "@mc/common/botPermissions";
import { generateInviteLink } from "@mc/common/generateInviteLink";
import logger from "@mc/logger";

import { EventHandler } from "../structures";

export const readyEvent = new EventHandler({
  name: "ready",
  handler: (client) => {
    logger.info("Bot ready");
    logger.info(`Logged in as ${client.user.tag}`);
    logger.info(
      `Invite link: ${generateInviteLink({ clientId: client.user.id, permissions: botPermissions })}`,
    );
  },
});
