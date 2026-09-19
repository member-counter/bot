import type { DemoServerData } from "@mc/services/demoServers";
import { useMemo } from "react";
import { ChannelType } from "discord-api-types/v10";
import { useTranslation } from "react-i18next";

import { cn } from "@mc/ui";
import { Separator } from "@mc/ui/separator";

import { Badge } from "./Badge";
import { ChannelNavItem, ChannelNavItemSkeleton } from "./ChannelNavItem";
import { channelListColor } from "./colors";
import { GlassPane } from "./GlassPane";

type ChannelGroup =
  | { type: "glass"; indices: number[] }
  | { type: "normal"; index: number }
  | { type: "skeleton"; index: number };

function groupChannels(
  channels: DemoServerData["channels"],
  highlighted: boolean,
): ChannelGroup[] {
  const groups: ChannelGroup[] = [];
  let currentGlass: number[] | null = null;

  for (let i = 0; i < channels.length; i++) {
    const channel = channels[i];
    if (!channel) continue;
    const isCounter =
      highlighted &&
      !channel.showAsSkeleton &&
      (channel.type as ChannelType) === ChannelType.GuildVoice;

    if (isCounter) {
      currentGlass ??= [];
      currentGlass.push(i);
    } else {
      if (currentGlass) {
        groups.push({ type: "glass", indices: currentGlass });
        currentGlass = null;
      }
      if (channel.showAsSkeleton) {
        groups.push({ type: "skeleton", index: i });
      } else {
        groups.push({ type: "normal", index: i });
      }
    }
  }
  if (currentGlass) {
    groups.push({ type: "glass", indices: currentGlass });
  }

  return groups;
}

export function ServerNavMenu({
  className,
  selectedChannelIndex,
  setSelectedChannelIndex,
  demoServer,
  highlighted,
  tilt,
}: {
  className?: string;
  selectedChannelIndex: number;
  setSelectedChannelIndex: (selectedChannelIndex: number) => void;
  demoServer: DemoServerData;
  highlighted?: boolean;
  tilt?: { rotateX: number; rotateY: number };
}) {
  const { t } = useTranslation();

  const channelGroups = useMemo(
    () => groupChannels(demoServer.channels, !!highlighted),
    [demoServer.channels, highlighted],
  );

  return (
    <nav
      className={cn(
        "flex max-h-full flex-col overflow-hidden transition-all duration-500",
        "w-[240px] min-w-[240px]",
        className,
      )}
      aria-label={`${demoServer.name} ${t("pages.dashboard.servers.ServerNavMenu.channelList")}`}
      style={{
        backgroundColor: channelListColor,
        transformStyle: "preserve-3d",
      }}
    >
      <div className="flex h-[48px] min-h-[48px] min-w-0 items-center pl-4 font-semibold shadow-[0_1px_0_rgba(4,4,5,.2),0_1.5px_0_rgba(6,6,7,.05),0_2px_0_rgba(4,4,5,.05)]">
        <div>
          <Badge
            premiumTier={demoServer.premiumTier}
            features={demoServer.features}
          />
        </div>
        <div
          className={
            "flex-shrink overflow-hidden text-ellipsis whitespace-nowrap"
          }
        >
          {demoServer.name}
        </div>
      </div>

      <Separator tabIndex={-1} />
      <div
        className="flex max-h-full grow flex-col gap-1 p-[8px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {channelGroups.map((group) => {
          if (group.type === "skeleton") {
            return <ChannelNavItemSkeleton key={group.index} />;
          }

          if (group.type === "normal") {
            const channel = demoServer.channels[group.index];
            if (!channel) return null;
            return (
              <ChannelNavItem
                key={group.index}
                isSelected={selectedChannelIndex === group.index}
                onClick={() => setSelectedChannelIndex(group.index)}
                {...channel}
              />
            );
          }

          // Glass group — adjacent counters wrapped in a single pane
          return (
            <GlassPane key={`glass-${group.indices[0]}`} tilt={tilt}>
              {group.indices.map((i) => {
                const channel = demoServer.channels[i];
                if (!channel) return null;
                return (
                  <ChannelNavItem
                    key={i}
                    isSelected={selectedChannelIndex === i}
                    onClick={() => setSelectedChannelIndex(i)}
                    {...channel}
                    highlighted
                  />
                );
              })}
            </GlassPane>
          );
        })}
        {new Array(15).fill(null).map((_, i) => (
          <ChannelNavItemSkeleton key={i} />
        ))}
      </div>
    </nav>
  );
}
