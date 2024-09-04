import type { LucideIcon } from "lucide-react";
 
import { CardBorderIlluminated  } from "@mc/ui/card";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function SupportedCountersCard(props: Props) {
  return (
    <CardBorderIlluminated>
      <article className={"flex flex-row gap-3 p-3"}>
        <props.icon className="mt-[4px] h-16 w-16 flex-none" />
        <div>
          <h1 className="text-md font-semibold tracking-tight">
            {props.title}
          </h1>
          <p className="text-sm">{props.description}</p>
        </div>
      </article>
    </CardBorderIlluminated>
  );
}
