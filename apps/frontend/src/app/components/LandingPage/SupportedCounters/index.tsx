import {
  CakeSliceIcon,
  CalculatorIcon,
  ClockIcon,
  EditIcon,
  GamepadIcon,
  HourglassIcon,
  LinkIcon,
  PartyPopperIcon,
  SparklesIcon,
  TwitchIcon,
  YoutubeIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { DiscordIcon } from "../../DiscordIcon";
import blackboard from "./assets/blackboard.png";
import datacenter from "./assets/datacenter.png";
import discordBg from "./assets/discord.png";
import document from "./assets/document.png";
import game from "./assets/game.png";
import highlight from "./assets/highlight.png";
import hourglass from "./assets/hourglass.png";
import map from "./assets/map.png";
import nitroBoosters from "./assets/nitroboosters.png";
import snoo from "./assets/snoo.png";
import twitchBg from "./assets/twitch.png";
import youtubeBg from "./assets/youtube.png";
import { SupportedCountersCard } from "./Card";

export const SupportedCounters = () => {
  const { t } = useTranslation();
  return (
    <div className="m-3 grid max-w-[1000px] grid-cols-1 gap-3 md:grid-cols-3 lg:m-0 lg:w-[1000px]">
      <SupportedCountersCard
        imgBgSrc={discordBg}
        icon={DiscordIcon}
        title={t("pages.home.supportedCounters.discordMembers.title")}
        description={t(
          "pages.home.supportedCounters.discordMembers.description",
        )}
      />
      <SupportedCountersCard
        imgBgSrc={map}
        icon={ClockIcon}
        title={t("pages.home.supportedCounters.clock.title")}
        description={t("pages.home.supportedCounters.clock.description")}
      />
      <SupportedCountersCard
        imgBgSrc={hourglass}
        icon={HourglassIcon}
        title={t("pages.home.supportedCounters.countdown.title")}
        description={t("pages.home.supportedCounters.countdown.description")}
      />
      <SupportedCountersCard
        imgBgSrc={game}
        icon={GamepadIcon}
        title={t("pages.home.supportedCounters.game.title")}
        description={t("pages.home.supportedCounters.game.description")}
      />
      <SupportedCountersCard
        imgBgSrc={datacenter}
        icon={LinkIcon}
        title={t("pages.home.supportedCounters.http.title")}
        description={t("pages.home.supportedCounters.http.description")}
      />
      <SupportedCountersCard
        imgBgSrc={blackboard}
        icon={CalculatorIcon}
        title={t("pages.home.supportedCounters.math.title")}
        description={t("pages.home.supportedCounters.math.description")}
      />
      <SupportedCountersCard
        imgBgSrc={nitroBoosters}
        icon={PartyPopperIcon}
        title={t("pages.home.supportedCounters.nitroBoosters.title")}
        description={t(
          "pages.home.supportedCounters.nitroBoosters.description",
        )}
      />
      <SupportedCountersCard
        imgBgSrc={snoo}
        icon={CakeSliceIcon}
        title={t("pages.home.supportedCounters.reddit.title")}
        description={t("pages.home.supportedCounters.reddit.description")}
      />
      <SupportedCountersCard
        imgBgSrc={document}
        icon={EditIcon}
        title={t("pages.home.supportedCounters.replace.title")}
        description={t("pages.home.supportedCounters.replace.description")}
      />
      <SupportedCountersCard
        imgBgSrc={twitchBg}
        icon={TwitchIcon}
        title={t("pages.home.supportedCounters.twitch.title")}
        description={t("pages.home.supportedCounters.twitch.description")}
      />
      <SupportedCountersCard
        imgBgSrc={youtubeBg}
        icon={YoutubeIcon}
        title={t("pages.home.supportedCounters.youtube.title")}
        description={t("pages.home.supportedCounters.youtube.description")}
      />
      <SupportedCountersCard
        imgBgSrc={highlight}
        icon={SparklesIcon}
        title={t("pages.home.supportedCounters.andMuchMore.title")}
        description={t("pages.home.supportedCounters.andMuchMore.description")}
      />
    </div>
  );
};
