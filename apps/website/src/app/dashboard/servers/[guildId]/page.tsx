"use client";

import type { LucideIcon } from "lucide-react";
import {
  BlocksIcon,
  CandlestickChartIcon,
  LandPlotIcon,
  ZapIcon,
} from "lucide-react";

import { cn } from "@mc/ui";
import { Card, CardContent, CardHeader } from "@mc/ui/card";

import { MenuButton } from "../../MenuButton";

// TODO actually implement the guides
const suggestedTopics: {
  title: string;
  description: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
}[] = [
  {
    icon: ZapIcon,
    title: "Quick-setup",
    description:
      "Quickly create the most common counters in a few clicks. No imagintion or brain required!",
    label: "Hasle free!",
  },
  {
    icon: LandPlotIcon,
    title: "Create from scratch",
    description:
      "Learn how to create your first custom counter in a few minutes",
    label: "Be unique!",
  },
  {
    icon: BlocksIcon,
    title: "Advanced counters",
    description: "Get the most out of your counters, tailored to your needs",
    label: "Like a pro",
  },
  {
    icon: CandlestickChartIcon,
    title: "Query historical statistics",
    description:
      "See how your counters and other common stats have evolved over time",
    label: "Coming Soon™",
    disabled: true,
  },
];

export default function Page() {
  return (
    <div className=" flex h-full select-none flex-col">
      <MenuButton className="my-1 mr-1" />
      <div className="flex h-full w-full grow flex-col items-center overflow-auto pt-4 text-center">
        <span className="mt-auto w-full">
          <h1 className="text-4xl font-semibold">Welcome back!</h1>
          <h2 className="text-md font-light">
            Here are some suggestions for you
          </h2>
        </span>
        <div className="mb-auto mt-4 flex flex-row flex-wrap justify-center gap-2 p-2">
          {suggestedTopics.map((topic, i) => (
            <article
              className="group"
              key={i}
              tabIndex={topic.disabled ? -1 : 0}
              role="button"
            >
              <Card
                className={cn(
                  "relative h-full w-full max-w-[400px] flex-shrink grow  cursor-pointer overflow-hidden",
                  topic.disabled && "cursor-not-allowed",
                )}
              >
                <div className="absolute z-10 h-[30px] w-full overflow-clip bg-primary transition-all duration-500 group-hover:scale-y-[25]"></div>
                <div className="relative z-10 w-full py-1 text-sm font-black uppercase leading-relaxed transition-all duration-300 group-hover:bg-black/30">
                  {topic.label}
                </div>
                <CardHeader>
                  <h1 className="relative z-10 text-xl font-bold">
                    <topic.icon
                      strokeWidth={0.8}
                      className="mr-2 inline-block h-8 w-8"
                      aria-hidden
                    />
                    {topic.title}
                  </h1>
                </CardHeader>
                <CardContent className="text-justify">
                  <p className="relative z-10">{topic.description}</p>
                </CardContent>
              </Card>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
