import { createContext, useMemo } from "react";
import { PermissionFlagsBits } from "discord-api-types/v10";
import { useTypedParams } from "react-router-typesafe-routes";

import { BitField } from "@mc/common/BitField";
import { routes } from "@mc/common/Routes";
import { UserPermissions } from "@mc/common/UserPermissions";

import { api } from "~/lib/trpc";
import invariant from "tiny-invariant";

export interface UserPermissionsContextValue {
  canRead: boolean;
  canModify: boolean;
  canInviteBot: boolean;
  user: BitField;
  guild: BitField;
  fetched: boolean;
}

export const UserPermissionsContext =
  createContext<UserPermissionsContextValue>({
    canRead: false,
    canModify: false,
    canInviteBot: false,
    user: new BitField(0n),
    guild: new BitField(0n),
    fetched: false,
  });

export const UserPermissionsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { guildId } = useTypedParams(routes.dashboard.servers.server);
  invariant(guildId, "Expected guildId to be defined");
  const authUser = api.session.user.useQuery();

  const userGuildsQuery = api.discord.userGuilds.useQuery(undefined, {
    initialData: () => ({ userGuilds: new Map() }),
  });
  const guild = userGuildsQuery.data.userGuilds.get(guildId);

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
      user: userPermissions,
      guild: userGuildPermissions,
      fetched: userGuildsQuery.isSuccess && authUser.isSuccess,
    };
  }, [
    authUser.data?.permissions,
    authUser.isSuccess,
    guild?.permissions,
    userGuildsQuery.isSuccess,
  ]);
  return (
    <UserPermissionsContext.Provider value={contextValue} children={children} />
  );
};
