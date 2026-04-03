import { lazy, Suspense, useEffect, useState } from "react";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import {
  ChevronDownIcon,
  LifeBuoyIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import TextTransition, { presets } from "react-text-transition";

import { routes } from "@mc/common/Routes";
import { cn } from "@mc/ui";
import { Button } from "@mc/ui/button";

import { Link } from "~/lib/navigation";
import { BotIcon } from "../BotIcon";
import { DiscordIcon } from "../DiscordIcon";
import { DiscordDemo } from "./DiscordDemo";
import { SupportedCounters } from "./SupportedCounters";

const Background = lazy(() =>
  import("./Background").then((m) => ({ default: m.Background })),
);

export default function LandingPage() {
  const { t } = useTranslation();
  const subheadings = t("pages.home.headings", {
    returnObjects: true,
  });

  const [currentSubheading, setCurrentSubheading] = useState(0);

  const [supportedCountersRef, supportedCountersEntry] =
    useIntersectionObserver({
      threshold: 0.3,
      root: null,
      rootMargin: "0%",
    });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSubheading((prevIndex) => (prevIndex + 1) % subheadings.length);
    }, 5000);
    return () => clearInterval(intervalId);
  });

  return (
    <div className="relative flex flex-col items-center justify-center gap-10 pb-10">
      <div className="fixed top-[0] z-[-1] h-[120px] w-full bg-gradient-to-b from-black"></div>
      <Suspense
        fallback={<div className="fixed z-[-2] h-full w-full bg-stone-950" />}
      >
        <Background className="fixed z-[-2]" />
      </Suspense>
      <div
        className="pointer-events-none fixed inset-0 z-[-1]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 75%, #0c0a09 0%, #0c0a09 15%, transparent 50%)",
        }}
      />
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
        <div className="grow"></div>
        <div className="flex flex-row items-center">
          <BotIcon className="relative top-[3px] ml-4 hidden h-20 w-20 min-w-20 md:block" />
          <h1
            className={cn(
              "font-major-mono",
              "py-3 text-center text-6xl font-extrabold md:ml-10 md:text-left",
            )}
          >
            Member counteR
          </h1>
        </div>
        <h2 className="text-center text-2xl">
          <TextTransition
            springConfig={presets.gentle}
            className="flex flex-col items-center"
          >
            {subheadings[currentSubheading]}
          </TextTransition>
        </h2>
        <div className="mt-6 flex w-full flex-col gap-2 px-2 sm:mt-3 sm:w-auto sm:flex-row [&>*>*]:w-full">
          <a href={routes.invite.$buildPath({})} target="_blank">
            <Button icon={DiscordIcon}>{t("pages.home.addToDiscord")}</Button>
          </a>
          <a href={routes.support.$buildPath({})} target="_blank">
            <Button icon={LifeBuoyIcon}>{t("pages.home.getSupport")}</Button>
          </a>
          <Link to={routes.dashboard.$buildPath({})}>
            <Button icon={SlidersHorizontalIcon}>
              {t("pages.home.dashboard")}
            </Button>
          </Link>
        </div>
        <div className="grow"></div>
        <a
          href="#supported-features"
          className={cn(
            "relative top-[-56px] p-10 text-lg transition-opacity lg:hidden",
            {
              "opacity-0": supportedCountersEntry?.isIntersecting,
            },
          )}
        >
          {t("pages.home.seeMore")}
          <ChevronDownIcon className="relative bottom-[1px] ml-2 inline" />
        </a>
        <div className="relative top-2 hidden flex-col gap-3 lg:flex">
          <DiscordDemo heading={t("pages.home.seeHowPeopleUseIt")} />
        </div>
      </div>
      <div className="flex flex-col gap-3" ref={supportedCountersRef}>
        <h3
          className="pt-[64px] text-center text-xl font-bold"
          id="supported-features"
        >
          {t("pages.home.supportedCounters_heading")}
        </h3>
        <SupportedCounters />
      </div>
    </div>
  );
}
