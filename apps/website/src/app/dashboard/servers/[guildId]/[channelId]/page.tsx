"use client";

interface Props {
  params: { channelId: string };
}

export default function Page(props: Props) {
  return (
    <div>
      <h1>Current selected channel: {props.params.channelId} </h1>
    </div>
  );
}
