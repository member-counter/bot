import type { DiscordUserGuild } from "@mc/validators/DiscordUserGuilds";
import { createContext, useMemo } from "react";
import { useParams } from "next/navigation";
import { PermissionFlagsBits } from "discord-api-types/v10";

import { BitField } from "@mc/common/BitField";
import { UserPermissions } from "@mc/common/UserPermissions";

import type { DashboardGuildParams } from "./layout";
import { api } from "~/trpc/react";

export interface UserPermissionsContextValue {
  canRead: boolean;
  canModify: boolean;
  canInviteBot: boolean;
}

export const UserPermissionsContext =
  createContext<UserPermissionsContextValue>({
    canRead: false,
    canModify: false,
    canInviteBot: false,
  });

export const UserPermissionsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { guildId } = useParams<DashboardGuildParams>();
  const authUser = api.session.user.useQuery();

  const {
    data: { userGuilds },
  } = api.discord.userGuilds.useQuery(undefined, {
    initialData: { userGuilds: new Map<string, DiscordUserGuild>() },
  });
  const guild = userGuilds.get(guildId);

  const contextValue: UserPermissionsContextValue = useMemo(() => {
    const userPermissions = new BitField(authUser.data?.permissions);
    const userGuildPermissions = new BitField(guild?.permissions);

    return {
      canRead:
        userGuildPermissions.any(
          PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageGuild,
        ) || userPermissions.has(UserPermissions.SeeGuilds),
      canModify:
        userGuildPermissions.any(
          PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageGuild,
        ) || userPermissions.has(UserPermissions.ManageGuilds),
      canInviteBot: userGuildPermissions.any(
        PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageGuild,
      ),
    };
  }, [authUser.data?.permissions, guild?.permissions]);
  return (
    <UserPermissionsContext.Provider value={contextValue} children={children} />
  );
};
