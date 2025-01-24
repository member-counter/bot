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
import document from "./assets/document.png";
import game from "./assets/game.png";
import highlight from "./assets/highlight.png";
import hourglass from "./assets/hourglass.png";
import map from "./assets/map.png";
import nitroBoosters from "./assets/nitroboosters.png";
import snoo from "./assets/snoo.png";
import { SupportedCountersCard } from "./Card";

// TODO change backgrounds for discord, twitch and youtube

export const SupportedCounters = () => {
  const { t } = useTranslation();
  return (
    <div className="m-3 grid max-w-[1000px] grid-cols-1 gap-3 md:grid-cols-3 lg:m-0 lg:w-[1000px]">
      <SupportedCountersCard
        imgBgClassName="bg-[#5662f6]"
        icon={DiscordIcon}
        title={t("pages.admin.homePage.supportedCounters.discordMembers.title")}
        description={t(
          "pages.admin.homePage.supportedCounters.discordMembers.description",
        )}
      />
      <SupportedCountersCard
        imgBgSrc={map}
        icon={ClockIcon}
        title={t("pages.admin.homePage.supportedCounters.clock.title")}
        description={t(
          "pages.admin.homePage.supportedCounters.clock.description",
        )}
      />
      <SupportedCountersCard
        imgBgSrc={hourglass}
        icon={HourglassIcon}
        title={t("pages.admin.homePage.supportedCounters.countdown.title")}
        description={t(
          "pages.admin.homePage.supportedCounters.countdown.description",
        )}
      />
      <SupportedCountersCard
        imgBgSrc={game}
        icon={GamepadIcon}
        title={t("pages.admin.homePage.supportedCounters.game.title")}
        description={t(
          "pages.admin.homePage.supportedCounters.game.description",
        )}
      />
      <SupportedCountersCard
        imgBgSrc={datacenter}
        icon={LinkIcon}
        title={t("pages.admin.homePage.supportedCounters.http.title")}
        description={t(
          "pages.admin.homePage.supportedCounters.http.description",
        )}
      />
      <SupportedCountersCard
        imgBgSrc={blackboard}
        icon={CalculatorIcon}
        title={t("pages.admin.homePage.supportedCounters.math.title")}
        description={t(
          "pages.admin.homePage.supportedCounters.math.description",
        )}
      />
      <SupportedCountersCard
        imgBgSrc={nitroBoosters}
        icon={PartyPopperIcon}
        title={t("pages.admin.homePage.supportedCounters.nitroBoosters.title")}
        description={t(
          "pages.admin.homePage.supportedCounters.nitroBoosters.description",
        )}
      />
      <SupportedCountersCard
        imgBgSrc={snoo}
        icon={CakeSliceIcon}
        title={t("pages.admin.homePage.supportedCounters.reddit.title")}
        description={t(
          "pages.admin.homePage.supportedCounters.reddit.description",
        )}
      />
      <SupportedCountersCard
        imgBgSrc={document}
        icon={EditIcon}
        title={t("pages.admin.homePage.supportedCounters.replace.title")}
        description={t(
          "pages.admin.homePage.supportedCounters.replace.description",
        )}
      />
      <SupportedCountersCard
        imgBgClassName="bg-[#a970ff]"
        icon={TwitchIcon}
        title={t("pages.admin.homePage.supportedCounters.twitch.title")}
        description={t(
          "pages.admin.homePage.supportedCounters.twitch.description",
        )}
      />
      <SupportedCountersCard
        imgBgClassName="bg-[#ff0033]"
        icon={YoutubeIcon}
        title={t("pages.admin.homePage.supportedCounters.youtube.title")}
        description={t(
          "pages.admin.homePage.supportedCounters.youtube.description",
        )}
      />
      <SupportedCountersCard
        imgBgSrc={highlight}
        icon={SparklesIcon}
        title={t("pages.admin.homePage.supportedCounters.andMuchMore.title")}
        description={t(
          "pages.admin.homePage.supportedCounters.andMuchMore.description",
        )}
      />
    </div>
  );
};
