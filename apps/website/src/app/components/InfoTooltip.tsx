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
  text?: React.ReactNode;
  children?: React.ReactNode;
}) {
  if (!text) return children;
  return (
    <>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild tabIndex={0}>
            {children ?? <InfoIcon className="ml-1 inline h-3 w-3" />}
          </TooltipTrigger>
          <TooltipContent>{text}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
