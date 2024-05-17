"use client";

import type { DashboardGuildPageProps } from "./layout";

type Props = DashboardGuildPageProps;

export default function Page(props: Props) {
  return (
    <div>
      <h1>Current selected server: {props.params.guildId} </h1>
    </div>
  );
}
