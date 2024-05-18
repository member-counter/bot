"use client";

import type { DashboardGuildParams } from "../layout";

export type DashboardGuildChannelParams = {
  channelId: string;
} & DashboardGuildParams;

interface Props {
  params: DashboardGuildChannelParams;
}

export default function Page(props: Props) {
  return (
    <div>
      <h1>Current selected channel: {props.params.channelId} </h1>
    </div>
  );
}
