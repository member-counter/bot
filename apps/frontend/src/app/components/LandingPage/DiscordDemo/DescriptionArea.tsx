import type { DemoServerData } from "@mc/services/demoServers";

import { Button } from "@mc/ui/button";

import { messageListColor } from "./colors";
import { DescriptionAreaTitle } from "./DescriptionAreaTitle";

export function DescriptionArea({
  demoServer,
  selectedChannelIndex,
}: {
  demoServer: DemoServerData;
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
      <div className="flex grow flex-col items-center justify-center overflow-hidden">
        <div className="w-[320px]">
          <div className="text-2xl font-semibold">{demoServer.name}</div>
          <div
            className="w-full"
            dangerouslySetInnerHTML={{ __html: demoServer.description }}
          ></div>
          <div className="mt-4 flex w-full flex-col gap-2">
            {demoServer.links.map((link, i) => (
              <Button key={i} asChild className="w-full">
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
