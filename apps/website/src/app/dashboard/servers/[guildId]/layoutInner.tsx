"use client";

import { useContext, useEffect, useId, useState } from "react";
import { useParams } from "next/navigation";

import { cn } from "@mc/ui";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@mc/ui/resizable";
import { Separator } from "@mc/ui/separator";

import type { DashboardGuildParams } from "./layout";
import { useBreakpoint } from "~/hooks/useBreakpoint";
import { api } from "~/trpc/react";
import { MenuContext } from "../../Menu";
import { ForbiddenPage } from "./ForbiddenPage";
import { InviteBotPage } from "./InviteBotPage";
import { LoadingPage } from "./LoadingPage";
import { ServerNavMenu } from "./ServerNavMenu/ServerNavMenu";
import { SidePanelContext } from "./SidePanelContext";
import { UserPermissionsContext } from "./UserPermissionsContext";

export default function LayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { guildId } = useParams<DashboardGuildParams>();
  const userPermissions = useContext(UserPermissionsContext);
  const isDesktop = useBreakpoint("md");
  const menuContext = useContext(MenuContext);

  const [sidePanelRef, setSidePanelRef] = useState<HTMLElement | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  useEffect(() => {
    if (!sidePanelRef) return;

    const mo = new MutationObserver(() =>
      setIsSidePanelOpen(sidePanelRef.hasChildNodes()),
    );

    mo.observe(sidePanelRef, { childList: true });

    return () => mo.disconnect();
  }, [sidePanelRef]);

  const mainId = useId();
  const asideId = useId();

  // Fetch and prefetch some data
  const has = api.guild.has.useQuery({
    discordGuildId: guildId,
  });
  api.guild.get.useQuery({
    discordGuildId: guildId,
  });
  api.guild.isBlocked.useQuery({
    discordGuildId: guildId,
  });
  api.discord.getGuild.useQuery({
    id: guildId,
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
              minSize={30}
              defaultSize={30}
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
