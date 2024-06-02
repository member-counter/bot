import { UserBadgesBitfield } from "@mc/common/UserBadges";
import { UserSettings } from "@mc/common/UserSettings";

import { EventHandler } from "../structures";

export const messageCreateEvent = new EventHandler({
  name: "messageCreate",
  handler: async (message) => {
    if (message.author.bot) return;
    const [, command] = message.content.split(/\s+/);

    if (command !== "patpat") {
      return;
    }

    const userSettings = await UserSettings.upsert(message.author.id);
    await userSettings.grantBadge(UserBadgesBitfield.PatPat);

    // Huevo de pascua:
    await message.channel.send(
      "https://eduardozgz.com/max?discord_cache_fix=" + Math.random(),
    );
    // i never thought i will ever been coding with a very cute guy -alex
  },
});
