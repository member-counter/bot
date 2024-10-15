import type { DemoServer } from "./DemoServer";
import { messageListColor } from "./colors";
import { DescriptionAreaTitle } from "./DescriptionAreaTitle";

export function DescriptionArea({
  demoServer,
  selectedChannelIndex,
}: {
  demoServer: DemoServer;
  selectedChannelIndex: number;
}) {
  return (
    <div
      className="flex h-full grow flex-col"
      style={{ backgroundColor: messageListColor }}
    >
      <DescriptionAreaTitle
        demoServer={demoServer}
        selectedChannelIndex={selectedChannelIndex}
      />
      <div className="grow overflow-hidden">
        <div className="w-fulll flex h-full items-center justify-center">
          <div
            className="w-[320px]"
            dangerouslySetInnerHTML={{ __html: demoServer.description }}
          ></div>
          {/* // TODO show links */}
        </div>
      </div>
    </div>
  );
}
