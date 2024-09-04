import {
  DivideIcon,
  MinusIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";

import { SupportedCountersCard } from "./Card";

export function SupportedCounters() {
  return (
    <div className="m-3 grid max-w-[1000px] grid-cols-1 gap-3 md:grid-cols-3 lg:m-0 lg:w-[1000px]">
      <SupportedCountersCard
        icon={PlusIcon}
        title="Add Counter"
        description="Add a new counter to your list"
      />
      <SupportedCountersCard
        icon={MinusIcon}
        title="Subtract Counter"
        description="Subtract a counter from your list"
      />
      <SupportedCountersCard
        icon={XIcon}
        title="Multiply Counter"
        description="Multiply two counters together"
      />
      <SupportedCountersCard
        icon={DivideIcon}
        title="Divide Counter"
        description="Divide one counter by another"
      />
    </div>
  );
}
