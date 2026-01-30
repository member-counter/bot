import { Route } from "react-router";

import Dashboard from "~/app/dashboard/page";
import ChannelLayout from "~/app/dashboard/servers/[guildId]/[channelId]/layout";
import ChannelPage from "~/app/dashboard/servers/[guildId]/[channelId]/page";
import GuildLayout from "~/app/dashboard/servers/[guildId]/layout";
import GuildPage from "~/app/dashboard/servers/[guildId]/page";
import SettingsLayout from "~/app/dashboard/servers/[guildId]/settings/layout";
import SettingsPage from "~/app/dashboard/servers/[guildId]/settings/page";

export default function RouterDashboard() {
  return (
    <>
      <Route index element={<Dashboard />} />
      <Route path="servers/:guildId" element={<GuildLayout />}>
        <Route index element={<GuildPage />} />
        <Route path=":channelId" element={<ChannelLayout />}>
          <Route index element={<ChannelPage />} />
        </Route>
        <Route path="settings" element={<SettingsLayout />}>
          <Route index element={<SettingsPage />} />
        </Route>
      </Route>
    </>
  );
}
