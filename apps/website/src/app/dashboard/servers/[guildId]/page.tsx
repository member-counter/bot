"use client";

interface Props {
  params: { guildId: string };
}

export default function Page(props: Props) {
  return (
    <div>
      <h1>Current selected server: {props.params.guildId} </h1>
    </div>
  );
}
