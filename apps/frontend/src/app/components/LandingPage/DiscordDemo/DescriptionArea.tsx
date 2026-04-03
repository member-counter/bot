import type { DemoServerData } from "@mc/services/demoServers";
import { useMemo } from "react";
import DOMPurify from "dompurify";

import { cn } from "@mc/ui";
import { Button } from "@mc/ui/button";

import { messageListColor } from "./colors";
import { DescriptionAreaTitle } from "./DescriptionAreaTitle";

export function DescriptionArea({
  demoServer,
  selectedChannelIndex,
  highlighted,
  hideBody,
  tilt,
}: {
  demoServer: DemoServerData;
  selectedChannelIndex: number;
  highlighted?: boolean;
  hideBody?: boolean;
  tilt?: { rotateX: number; rotateY: number };
}) {
  const description = useMemo(() => {
    return DOMPurify.sanitize(demoServer.description);
  }, [demoServer.description]);

  return (
    <div
      className={cn(
        "flex h-full grow flex-col transition-all duration-500",
        hideBody && "min-w-[350px]",
      )}
      style={{
        backgroundColor: messageListColor,
        transformStyle: "preserve-3d",
      }}
    >
      <DescriptionAreaTitle
        demoServer={demoServer}
        selectedChannelIndex={selectedChannelIndex}
        highlighted={highlighted}
        tilt={tilt}
      />
      {!hideBody && (
        <div className="flex grow flex-col items-center justify-center overflow-hidden">
          <div className="w-[320px]">
            <div className="text-2xl font-semibold">{demoServer.name}</div>
            <div
              className="w-full"
              dangerouslySetInnerHTML={{ __html: description }}
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
      )}
    </div>
  );
}
