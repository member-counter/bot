import type { TFunction } from "i18next";

import type { Searchable } from "..";
import type { GuildChannel } from "~/app/dashboard/servers/[guildId]/TemplateEditor/d-types";
import { channelDisplayName } from "~/app/dashboard/servers/[guildId]/ChannelMaps";

export function makeSercheableChannels(
  channels: Map<string, GuildChannel> | undefined,
  t: TFunction,
): Searchable<string>[] {
  const arrayRoles = [...(channels?.values() ?? [])];
  return arrayRoles.map((channels) => ({
    value: channels.id,
    keywords: [
      ...channelDisplayName(t, channels).split(/\s+/),
      // A hidden channel has no real name. Let the user search it by ID.
      ...(channels.obfuscated ? [channels.id] : []),
    ],
  }));
}
