import type { Searchable } from "..";
import type { GuildRole } from "~/app/dashboard/servers/[guildId]/TemplateEditor/d-types";

export function makeSercheableRoles(
  roles: Map<string, GuildRole> | undefined,
): Searchable<string>[] {
  const arrayRoles = [...(roles?.values() ?? [])];
  return arrayRoles.map((role) => ({
    value: role.id,
    keywords: role.name === "@everyone" ? ["everyone"] : role.name.split(/\s+/),
  }));
}
