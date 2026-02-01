import type { Searchable } from "..";
import type { GuildChannel } from "~/app/dashboard/servers/[guildId]/TemplateEditor/d-types";

export function makeSercheableChannels(
  channels: Map<string, GuildChannel> | undefined,
): Searchable<string>[] {
  const arrayRoles = [...(channels?.values() ?? [])];
  return arrayRoles.map((channels) => ({
    value: channels.id,
    keywords: channels.name.split(/\s+/),
  }));
}
