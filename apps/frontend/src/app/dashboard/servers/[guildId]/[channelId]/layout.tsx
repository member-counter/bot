import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import { useTypedParams } from "react-router-typesafe-routes";
import invariant from "tiny-invariant";

import { routes } from "@mc/common/Routes";
import { Separator } from "@mc/ui/separator";

import { api } from "~/lib/trpc";
import { MenuButton } from "../../../Menu";
import { ChannelLabelMap, useChannelIcon } from "../ChannelMaps";

export default function Layout() {
  const { channelId, guildId } = useTypedParams(
    routes.dashboard.servers.server.channel,
  );
  invariant(channelId, "Expected channelId to be defined");
  invariant(guildId, "Expected guildId to be defined");

  const { t } = useTranslation();
  const guild = api.discord.getGuild.useQuery({ id: guildId });
  const channel = guild.data?.channels.get(channelId);

  const Icon = useChannelIcon(channelId);

  let label: string | undefined;
  if (channel) label = ChannelLabelMap(t)[channel.type];
  label ??= t("common.unknownChannelType");

  const name = channel?.name ?? t("common.unknownChannel");

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[48px] w-full flex-shrink-0 flex-row items-center pl-3 pr-1 font-semibold">
        <Icon className="mr-3 h-5 w-5" aria-label={label} />
        <h1
          aria-label={`${guild.data?.name ?? t("common.unknownServer")}: ${name}`}
        >
          {name}
        </h1>
        <MenuButton />
      </div>
      <Separator orientation="horizontal" />
      <div className="grow overflow-hidden">
        <div className="h-full overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
