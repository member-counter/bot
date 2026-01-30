import { useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useTypedParams } from "react-router-typesafe-routes";

import { routes } from "@mc/common/Routes";
import { cn } from "@mc/ui";

import { api } from "~/lib/trpc";
import DSelector from "../components/DSelector";
import { MenuContext } from "./Menu";

export default function Layout() {
  const trpcUtils = api.useUtils();
  const isAuthenticated = api.session.isAuthenticated.useQuery();
  const navigate = useNavigate();
  const params = useTypedParams(routes.dashboard.servers.server);
  const userGuildsQuery = api.discord.userGuilds.useQuery(undefined, {
    initialData: () => ({ userGuilds: new Map() }),
  });

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const menuContextValue = useMemo(
    () => ({
      isOpen: isMenuOpen,
      setIsOpen: setIsMenuOpen,
    }),
    [isMenuOpen],
  );

  // margin-top/padding-top to leave space for the nav bar but keeping the actual box under it
  const overflowClass = "mt-[-57px] pt-[57px] max-h-screen overflow-auto";

  if (isAuthenticated.data != null && !isAuthenticated.data) {
    void navigate(routes.login.$buildPath({}));
  }

  return (
    <MenuContext.Provider value={menuContextValue}>
      <div className="flex grow flex-row bg-black">
        <DSelector
          isPending={!userGuildsQuery.isFetched}
          className={cn(
            overflowClass,
            "mb-0 overflow-x-hidden bg-black pb-3 pt-[68px] transition-all duration-100",
            {
              "ml-[-72px] mr-[8px] sm:ml-[0] sm:mr-[0]": !isMenuOpen,
            },
          )}
          classNameForItem={"bg-card hover:bg-primary focus-within:bg-primary"}
          pre={[]}
          guilds={[...userGuildsQuery.data.userGuilds.values()].map(
            (guild) => ({
              ...guild,
              onClick: () => {
                void navigate(
                  routes.dashboard.servers.server.$buildPath({
                    params: { guildId: guild.id },
                  }),
                );
              },
              onHover: () => {
                void trpcUtils.discord.getGuild.prefetch({ id: guild.id });
                void trpcUtils.guild.has.prefetch({ discordGuildId: guild.id });
                void trpcUtils.guild.get.prefetch({ discordGuildId: guild.id });
                void trpcUtils.guild.isBlocked.prefetch({ discordGuildId: guild.id });
                void trpcUtils.guild.channels.logs.getAll.prefetch({ discordGuildId: guild.id });
                void trpcUtils.guild.channels.getAll.prefetch({ discordGuildId: guild.id });
              },
              isSelected: params.guildId === guild.id,
            }),
          )}
        />
        <div
          className={cn(
            overflowClass,
            "flex grow flex-col bg-black pb-[10px] pr-[10px] pt-[67px]",
          )}
        >
          <div className="h-full max-h-full rounded border border-border bg-[#181514]">
            <Outlet />
          </div>
        </div>
      </div>
    </MenuContext.Provider>
  );
}
