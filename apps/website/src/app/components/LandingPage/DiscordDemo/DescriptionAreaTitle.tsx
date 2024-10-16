import type { DemoServerData } from "@mc/common/DemoServers";
import type { LucideIcon } from "lucide-react";
import { HelpCircleIcon } from "lucide-react";

import type { DemoServer } from "./DemoServer";
import { ChannelIconMap } from "~/app/dashboard/servers/[guildId]/ChannelMaps";

export function DescriptionAreaTitle({
  demoServer,
  selectedChannelIndex,
}: {
  demoServer: DemoServerData;
  selectedChannelIndex: number;
}) {
  const selectedChannel = demoServer.channels[selectedChannelIndex];

  if (!selectedChannel) return null;

  const Icon: LucideIcon =
    ChannelIconMap[selectedChannel.type] ?? HelpCircleIcon;

  return (
    <div className="flex h-[48px] w-full flex-shrink-0 flex-row items-center pl-3 pr-1 font-semibold  shadow-[0_1px_0_rgba(4,4,5,.2),0_1.5px_0_rgba(6,6,7,.05),0_2px_0_rgba(4,4,5,.05)]">
      <Icon className="mr-3 h-5 w-5" />
      <h1>{selectedChannel.name}</h1>
      {selectedChannel.topic && (
        <>
          <div className="mx-[14px] h-[25px] border-l-[1px] border-l-[#4f5155]"></div>
          <div className="text-[0.9rem] font-normal text-[#b4b4b4]">
            {selectedChannel.topic}
          </div>
        </>
      )}
    </div>
  );
}
