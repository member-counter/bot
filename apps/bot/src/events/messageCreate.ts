import { BitField } from "@mc/common/BitField";
import { UserBadgesBitfield } from "@mc/common/UserBadges";
import { UserSettings } from "@mc/common/UserSettings";

import { EventHandler } from "../structures";

export const messageCreateEvent = new EventHandler({
  name: "messageCreate",
  handler: async (message) => {
    if (message.author.bot) return;
    const [, command] = message.content.split(/\s+/);

    if (command?.toLowerCase() !== "patpat") {
      return;
    }

    const userSettings = await UserSettings.upsert(message.author.id);

    const userBadges = new BitField(userSettings.badges);
    userBadges.add(UserBadgesBitfield.PatPat);

    await UserSettings.update(userSettings.id, {
      ...userSettings,
      badges: userBadges.bitfield,
    });

    // Huevo de pascua:
    await message.channel.send(
      "https://eduardozgz.com/max?nocache=" + Math.random(),
    );
    // i never thought i will ever been coding with a very cute guy -alex
  },
});
