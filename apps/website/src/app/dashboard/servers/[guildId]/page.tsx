"use client";

export interface DashboardGuildPageProps {
  params: { guildId: string };
}

export default function Page(props: DashboardGuildPageProps) {
  return (
    <div>
      <h1>Current selected server: {props.params.guildId} </h1>
    </div>
  );
}
