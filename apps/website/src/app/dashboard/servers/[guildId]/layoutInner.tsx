import { useContext, useEffect, useId, useState } from "react";
import { useTypedParams } from "react-router-typesafe-routes";

import { routes } from "@mc/common/Routes";
import { cn } from "@mc/ui";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@mc/ui/resizable";
import { Separator } from "@mc/ui/separator";

import { useBreakpoint } from "~/lib/hooks/useBreakpoint";
import { api } from "~/lib/trpc";
import { MenuContext } from "../../Menu";
import { ForbiddenPage } from "./ForbiddenPage";
import { InviteBotPage } from "./InviteBotPage";
import { LoadingPage } from "../../../components/LoadingPage";
import { ServerNavMenu } from "./ServerNavMenu/ServerNavMenu";
import { SidePanelContext } from "./SidePanelContext";
import { UserPermissionsContext } from "./UserPermissionsContext";
import invariant from "tiny-invariant";

export default function LayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { guildId } = useTypedParams(routes.dashboard.servers.server);
  invariant(guildId, "Expected guildId to be defined");
  const userPermissions = useContext(UserPermissionsContext);
  const isDesktop = useBreakpoint("sm");
  const isWideScreen = useBreakpoint("xl");
  const menuContext = useContext(MenuContext);
  invariant(menuContext, "Expected menuContext to be defined");
  const [sidePanelRef, setSidePanelRef] = useState<HTMLElement | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  useEffect(() => {
    if (!sidePanelRef) return;

    const mo = new MutationObserver(() =>
      setIsSidePanelOpen(sidePanelRef.hasChildNodes()),
    );

    mo.observe(sidePanelRef, { childList: true });

    return () => mo.disconnect();
  }, [sidePanelRef, isDesktop]);

  const mainId = useId();
  const asideId = useId();

  // Fetch and prefetch some data
  const has = api.guild.has.useQuery({
    discordGuildId: guildId,
  });
  api.guild.get.usePrefetchQuery({
    discordGuildId: guildId,
  });
  api.guild.isBlocked.usePrefetchQuery({
    discordGuildId: guildId,
  });
  api.discord.getGuild.usePrefetchQuery({
    id: guildId,
  });
  api.guild.channels.logs.getAll.usePrefetchQuery({
    discordGuildId: guildId,
  });
  const [{ channels }] = api.guild.channels.getAll.useSuspenseQuery({
    discordGuildId: guildId,
  });
  api.useQueries((t) =>
    [...channels.keys()].map((channelId) =>
      t.guild.channels.get({
        discordGuildId: guildId,
        discordChannelId: channelId,
      }),
    ),
  );

  if (!has.isSuccess || !userPermissions.fetched) {
    return <LoadingPage />;
  }

  if (!has.data) {
    return <InviteBotPage />;
  }

  if (!userPermissions.canRead) {
    return <ForbiddenPage />;
  }

  return (
    <div className="flex h-full max-h-full w-full">
      <ServerNavMenu
        className={cn("w-full sm:w-[240px] sm:min-w-[240px]", {
          "hidden sm:flex": !menuContext.isOpen,
        })}
      />
      <Separator orientation="vertical" className="hidden sm:block" />
      <ResizablePanelGroup
        direction="horizontal"
        style={{ ...(menuContext.isOpen && !isDesktop && { width: 0 }) }}
      >
        <ResizablePanel id={mainId} minSize={40} order={1} collapsedSize={0}>
          <main
            className={cn("h-full grow overflow-hidden", {
              "hidden sm:block": menuContext.isOpen,
            })}
          >
            <SidePanelContext.Provider value={sidePanelRef}>
              {children}
            </SidePanelContext.Provider>
          </main>
        </ResizablePanel>
        {isDesktop && (
          <>
            {isSidePanelOpen && <ResizableHandle />}
            <ResizablePanel
              id={asideId}
              minSize={isWideScreen ? 30 : 36}
              defaultSize={isWideScreen ? 30 : 36}
              maxSize={isWideScreen ? 60 : 50}
              order={1}
              className={cn({ hidden: !isSidePanelOpen })}
            >
              <aside
                ref={setSidePanelRef}
                className={cn("h-full flex-shrink-0")}
              ></aside>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
