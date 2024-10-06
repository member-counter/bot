"use client";

import type { TFunction } from "i18next";
import type { LucideIcon } from "lucide-react";
import {
  BlocksIcon,
  CandlestickChartIcon,
  LandPlotIcon,
  ZapIcon,
} from "lucide-react";

import { cn } from "@mc/ui";
import { Card, CardContent, CardHeader } from "@mc/ui/card";

import { useTranslation } from "~/i18n/client";
import { MenuButton } from "../../Menu";

// TODO link guides to docs
const suggestedTopics = (
  t: TFunction,
): {
  title: string;
  description: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
}[] => [
  {
    icon: ZapIcon,
    title: t("pages.dashboard.servers.suggestedTopics.quickSetup.title"),
    description: t(
      "pages.dashboard.servers.suggestedTopics.quickSetup.description",
    ),
    label: t("pages.dashboard.servers.suggestedTopics.quickSetup.label"),
  },
  {
    icon: LandPlotIcon,
    title: t("pages.dashboard.servers.suggestedTopics.createFromScratch.title"),
    description: t(
      "pages.dashboard.servers.suggestedTopics.createFromScratch.description",
    ),
    label: t("pages.dashboard.servers.suggestedTopics.createFromScratch.label"),
  },
  {
    icon: BlocksIcon,
    title: t("pages.dashboard.servers.suggestedTopics.advancedCounters.title"),
    description: t(
      "pages.dashboard.servers.suggestedTopics.advancedCounters.description",
    ),
    label: t("pages.dashboard.servers.suggestedTopics.advancedCounters.label"),
  },
  {
    icon: CandlestickChartIcon,
    title: t(
      "pages.dashboard.servers.suggestedTopics.queryHistoricalStatistics.title",
    ),
    description: t(
      "pages.dashboard.servers.suggestedTopics.queryHistoricalStatistics.description",
    ),
    label: t(
      "pages.dashboard.servers.suggestedTopics.queryHistoricalStatistics.label",
    ),
    disabled: true,
  },
];

export default function Page() {
  const [t] = useTranslation();

  return (
    <div className="flex h-full select-none flex-col">
      <MenuButton className="my-1 mr-1" />
      <div className="flex h-full w-full grow flex-col items-center overflow-auto pt-4 text-center">
        <span className="mt-auto w-full">
          <h1 className="text-4xl font-semibold">
            {t("pages.dashboard.servers.suggestedTopics.title")}
          </h1>
          <h2 className="text-md font-light">
            {t("pages.dashboard.servers.suggestedTopics.subTitle")}
          </h2>
        </span>
        <div className="mb-auto mt-4 flex flex-row flex-wrap justify-center gap-2 p-2">
          {suggestedTopics(t).map((topic, i) => (
            <article
              className="group"
              key={i}
              tabIndex={topic.disabled ? -1 : 0}
              role="button"
            >
              <Card
                className={cn(
                  "relative h-full w-full max-w-[400px] flex-shrink grow cursor-pointer overflow-hidden",
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
