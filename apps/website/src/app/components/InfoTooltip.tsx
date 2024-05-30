import { InfoIcon } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mc/ui/tooltip";

export function InfoToolip({
  text,
  children,
}: {
  text?: string;
  children?: React.ReactNode;
}) {
  if (!text) return children;
  return (
    <>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            {children ?? <InfoIcon className="ml-1 inline h-3 w-3" />}
          </TooltipTrigger>
          <TooltipContent>
            <span>{text}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
