import type { Client } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";

import { BrandingColors as Colors } from "../Constants";
import { env } from "../env";

export class BaseEmbed extends EmbedBuilder {
  constructor(
    client: Client<true>,
    options?: ConstructorParameters<typeof EmbedBuilder>[0],
  ) {
    super(options);
    if (!options?.color) {
      this.setColor(Colors.Primary);
    }

    this.setFooter({
      text: env.WEBSITE_URL,
      iconURL: client.user.displayAvatarURL({ extension: "jpeg" }),
    });
  }
}
