import { useEffect, useState } from "react";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import {
  ChevronDownIcon,
  LifeBuoyIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import TextTransition, { presets } from "react-text-transition";

import { routes } from "@mc/common/Routes";
import { cn } from "@mc/ui";
import { Button } from "@mc/ui/button";

import { BotIcon } from "../BotIcon";
import { DiscordIcon } from "../DiscordIcon";
import { Background } from "./Background";
import { DiscordDemo } from "./DiscordDemo";
import { SupportedCounters } from "./SupportedCounters";

// TODO SOME PARTS NOT TRANSLATED

export default function LandingPage() {
  const { t } = useTranslation();
  const subheadings = t("pages.admin.homePage.headings", {
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
      <Background className="fixed z-[-2]" />
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
            <Button icon={DiscordIcon}>Add to Discord</Button>
          </a>
          <a href={routes.support.$buildPath({})} target="_blank">
            <Button icon={LifeBuoyIcon}>Get Support</Button>
          </a>
          <Link to={routes.dashboard.$buildPath({})}>
            <Button icon={SlidersHorizontalIcon}>Dashboard</Button>
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
          See more
          <ChevronDownIcon className="relative bottom-[1px] ml-2 inline" />
        </a>
        <div className="relative top-2 hidden flex-col gap-3 lg:flex">
          <h3 className="text-center text-xl font-bold">
            See how people use it
          </h3>
          <DiscordDemo />
        </div>
      </div>
      <div className="flex flex-col gap-3" ref={supportedCountersRef}>
        <h3
          className="pt-[64px] text-center text-xl font-bold"
          id="supported-features"
        >
          Supported counters
        </h3>
        <SupportedCounters />
      </div>
    </div>
  );
}
