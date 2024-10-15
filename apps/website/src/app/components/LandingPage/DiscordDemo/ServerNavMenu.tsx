import { useTranslation } from "react-i18next";

import { cn } from "@mc/ui";
import { Separator } from "@mc/ui/separator";

import type { DemoServer } from "./DemoServer";
import { ChannelNavItem, ChannelNavItemSkeleton } from "./ChannelNavItem";
import { channelListColor } from "./colors";

export function ServerNavMenu({
  className,
  selectedChannelIndex,
  setSelectedChannelIndex,
  demoServer,
}: {
  className?: string;
  selectedChannelIndex: number;
  setSelectedChannelIndex: (selectedChannelIndex: number) => void;
  demoServer: DemoServer;
}) {
  const { t } = useTranslation();

  return (
    <nav
      className={cn(
        "flex max-h-full w-[240px] min-w-[240px] flex-col overflow-hidden",
        className,
      )}
      aria-label={`${demoServer.name} ${t("pages.dashboard.servers.ServerNavMenu.channelList")}`}
      style={{ backgroundColor: channelListColor }}
    >
      <div className="flex h-[48px] min-h-[48px] min-w-0 items-center font-semibold shadow-[0_1px_0_rgba(4,4,5,.2),0_1.5px_0_rgba(6,6,7,.05),0_2px_0_rgba(4,4,5,.05)]">
        <div
          className={
            "flex-shrink overflow-hidden  text-ellipsis whitespace-nowrap pl-4"
          }
        >
          {demoServer.name}
        </div>
      </div>

      <Separator tabIndex={-1} />
      <div className="flex max-h-full grow flex-col gap-1  p-[8px]">
        {demoServer.channels.map((channel, i) => (
          <ChannelNavItem
            isSelected={selectedChannelIndex === i}
            onClick={() => setSelectedChannelIndex(i)}
            {...channel}
            key={channel.name}
          />
        ))}
        {new Array(15).fill(null).map((_, i) => (
          <ChannelNavItemSkeleton key={i} />
        ))}
      </div>
    </nav>
  );
}
