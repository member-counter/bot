import { useContext, useEffect, useId, useState } from "react";
import { Outlet } from "react-router";
import { useTypedParams } from "react-router-typesafe-routes";
import invariant from "tiny-invariant";

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
import { LoadingPage } from "../../../components/LoadingPage";
import { MenuContext } from "../../Menu";
import { BlockedBanner } from "./BlockedBanner";
import { ForbiddenPage } from "./ForbiddenPage";
import { InviteBotBanner } from "./InviteBotBanner";
import { InviteBotPage } from "./InviteBotPage";
import { ServerNavMenu } from "./ServerNavMenu/ServerNavMenu";
import { SidePanelContext } from "./SidePanelContext";
import {
  useCreateUserPermissions,
  UserPermissionsContext,
} from "./UserPermissionsContext";

export default function Layout() {
  const { guildId } = useTypedParams(routes.dashboard.servers.server);
  invariant(guildId, "Expected guildId to be defined");
  const userPermissions = useCreateUserPermissions();
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

  const has = api.guild.has.useQuery({
    discordGuildId: guildId,
  });

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
    <UserPermissionsContext.Provider value={userPermissions}>
      <div className="flex h-full max-h-full flex-col overflow-hidden rounded">
        <BlockedBanner />
        <InviteBotBanner />
        <div className="grow overflow-hidden">
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
              <ResizablePanel
                id={mainId}
                minSize={40}
                order={1}
                collapsedSize={0}
              >
                <main
                  className={cn("h-full grow overflow-hidden", {
                    "hidden sm:block": menuContext.isOpen,
                  })}
                >
                  <SidePanelContext.Provider value={sidePanelRef}>
                    <Outlet />
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
        </div>
      </div>
    </UserPermissionsContext.Provider>
  );
}
