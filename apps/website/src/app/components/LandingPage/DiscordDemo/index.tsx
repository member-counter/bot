import React, { useEffect, useMemo, useState } from "react";
import { ChannelType } from "discord-api-types/v10";
import { useTranslation } from "react-i18next";

import { cn } from "@mc/ui";

import { api } from "~/trpc/react";
import DSelector from "../../DSelector";
import { serverListColor } from "./colors";
import { DescriptionArea } from "./DescriptionArea";
import { ServerNavMenu } from "./ServerNavMenu";

export function DiscordDemo() {
  const { i18n } = useTranslation();

  const [mouseIsHovering, setMouseIsHovering] = useState(false);
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);
  const [selectedChannelIndex, setSelectedChannelIndex] = useState(-1);
  const demoServersQuery = api.demoServers.geAll.useQuery();
  const demoServers = useMemo(() => {
    const demoServers = demoServersQuery.data ?? [];
    return demoServers.sort((a) => (a.language === i18n.language ? -1 : 1));
  }, [demoServersQuery.data, i18n.language]);

  const selectedServer = demoServers[selectedServerIndex];

  useEffect(() => {
    if (!mouseIsHovering) {
      const serverSelection = setInterval(() => {
        let nextServer = selectedServerIndex + 1;
        if (nextServer === demoServers.length) nextServer = 0;
        setSelectedServerIndex(nextServer);
      }, 7 * 1000);
      return () => {
        clearInterval(serverSelection);
      };
    }
  }, [demoServers.length, mouseIsHovering, selectedServerIndex]);

  useEffect(() => {
    if (!selectedServer) return;
    setSelectedChannelIndex(
      selectedServer.channels.findIndex(
        (channel) =>
          [ChannelType.GuildText, ChannelType.GuildAnnouncement].includes(
            channel.type,
          ) && !channel.showAsSkeleton,
      ),
    );
  }, [selectedServer]);

  if (!selectedServer) return null;

  return (
    <div
      className={cn("flex h-[550px] w-[1000px] overflow-hidden rounded-lg")}
      style={{ backgroundColor: serverListColor }}
      role="none"
      tabIndex={-1}
      onMouseEnter={() => setMouseIsHovering(true)}
      onMouseLeave={() => setMouseIsHovering(false)}
      onFocus={() => setMouseIsHovering(true)}
      onBlur={() => setMouseIsHovering(false)}
    >
      <DSelector
        pre={[]}
        guilds={demoServers.map((server, i) => ({
          ...server,
          isSelected: i === selectedServerIndex,
          onClick: () => setSelectedServerIndex(i),
        }))}
      />
      <ServerNavMenu
        demoServer={selectedServer}
        selectedChannelIndex={selectedChannelIndex}
        setSelectedChannelIndex={setSelectedChannelIndex}
      />
      <DescriptionArea
        demoServer={selectedServer}
        selectedChannelIndex={selectedChannelIndex}
      />
    </div>
  );
}
