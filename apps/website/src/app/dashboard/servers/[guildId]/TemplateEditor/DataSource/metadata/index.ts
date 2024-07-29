import type {
  DataSource,
  DataSourceBotStats,
  DataSourceChannels,
  DataSourceClock,
  DataSourceCountdown,
  DataSourceGame,
  DataSourceHTTP,
  DataSourceMath,
  DataSourceMembers,
  DataSourceMemerator,
  DataSourceNitroBoosters,
  DataSourceNumber,
  DataSourceReddit,
  DataSourceReplace,
  DataSourceRoles,
  DataSourceTwitch,
  DataSourceUnknown,
  DataSourceYoutube,
} from "@mc/common/DataSource";
import type { TFunction } from "i18next";
import type { LucideIcon } from "lucide-react";
import { useMemo } from "react";
import {
  BotIcon,
  CakeSliceIcon,
  CalculatorIcon,
  ClockIcon,
  FerrisWheelIcon,
  Gamepad2Icon,
  HashIcon,
  HelpCircleIcon,
  HourglassIcon,
  LinkIcon,
  PartyPopperIcon,
  ReplaceIcon,
  TagsIcon,
  Tally5Icon,
  TwitchIcon,
  UsersIcon,
  YoutubeIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  DataSourceId,
  FilterMode,
  MathDataSourceOperation,
  MembersFilterAccountType,
  MembersFilterStatus,
  MemeratorDataSourceReturn,
  RedditDataSourceReturn,
  TwitchDataSourceReturn,
  YouTubeDataSourceReturn,
} from "@mc/common/DataSource";

import type { DataSourceMetadata } from "./DataSourceMetadata";
import type { Searchable } from "~/app/components/Combobox";
import { DataSourceMetadataMath } from "./DataSourceMetadataMath";

const membersDataSourceMetadata: DataSourceMetadata<DataSourceMembers> = {
  icon: UsersIcon,
  description:
    "Count members, you can also filter them by their online status, specific roles and more.",
  displayName: (dataSource) => {
    if (!dataSource.options) return "Members";

    const {
      accountTypeFilter,
      bannedMembers,
      playing,
      roleFilterMode,
      roles,
      statusFilter,
      connectedTo,
    } = dataSource.options;

    if (bannedMembers) return "Banned members";

    const displayName = [];

    if (statusFilter === MembersFilterStatus.ONLINE) {
      displayName.push("online");
    } else if (statusFilter === MembersFilterStatus.DND) {
      displayName.push("DND");
    } else if (statusFilter === MembersFilterStatus.OFFLINE) {
      displayName.push("offline");
    } else if (statusFilter === MembersFilterStatus.IDLE) {
      displayName.push("idle");
    }

    if (accountTypeFilter === MembersFilterAccountType.BOT) {
      displayName.push("bots");
    } else if (accountTypeFilter === MembersFilterAccountType.USER) {
      displayName.push("users");
    } else {
      displayName.push("members");
    }

    if (roles?.length) {
      displayName.push("with");
      if (roleFilterMode === FilterMode.AND) {
        displayName.push("overlaping");
      }

      displayName.push("roles");
    }

    if (connectedTo?.length) {
      displayName.push("connected to a channel");
    }

    if (playing?.length) {
      displayName.push("while playing a game");
    }

    const displayNameString = displayName.join(" ");

    return (
      displayNameString.charAt(0).toUpperCase() + displayNameString.slice(1)
    );
  },
  dataSource: { id: DataSourceId.MEMBERS },
  keywords: [
    "members",
    "filter",
    "roles",
    "online",
    "status",
    "banned",
    "playing",
    "online",
    "offline",
    "dnd",
    "disturb",
    "idle",
    "afk",
    "user",
    "bot",
    "connected",
  ],
};
const gameDataSourceMetadata: DataSourceMetadata<DataSourceGame> = {
  icon: Gamepad2Icon,
  description:
    "Retrieve the current number of online players in your game server, compatible with more than 320 games.",
  displayName: (dataSource: DataSourceGame) => {
    if (
      !dataSource.options?.address ||
      typeof dataSource.options.address === "object"
    )
      return "Game";
    return "Player count for " + dataSource.options.address;
  },
  dataSource: { id: DataSourceId.GAME },
  keywords: ["game", "players", "online", "server"],
};
const youtubeDataSourceMetadata: DataSourceMetadata<DataSourceYoutube> = {
  icon: YoutubeIcon,
  description:
    "Fetch subscriber count, video count, and total views from a YouTube channel.",
  displayName: (dataSource: DataSourceYoutube) => {
    if (!dataSource.options || typeof dataSource.options.return !== "number")
      return "YouTube";

    const displayName = ["youtube"];

    const display = {
      [YouTubeDataSourceReturn.CHANNEL_NAME]: "channel name",
      [YouTubeDataSourceReturn.SUBSCRIBERS]: "subscribers",
      [YouTubeDataSourceReturn.VIDEOS]: "videos",
      [YouTubeDataSourceReturn.VIEWS]: "views",
    };

    displayName.push(display[dataSource.options.return]);

    const displayNameString = displayName.join(" ");

    return (
      displayNameString.charAt(0).toUpperCase() + displayNameString.slice(1)
    );
  },
  dataSource: { id: DataSourceId.YOUTUBE },
  keywords: ["YouTube", "subscriber", "video", "views", "channel"],
};
const twitchDataSourceMetadata: DataSourceMetadata<DataSourceTwitch> = {
  icon: TwitchIcon,
  description:
    "Retrieve follower count and total view count for a Twitch channel.",
  displayName: (dataSource: DataSourceTwitch) => {
    if (!dataSource.options || typeof dataSource.options.return !== "number")
      return "Twitch";

    const displayName = ["twitch"];

    const display = {
      [TwitchDataSourceReturn.CHANNEL_NAME]: "channel name",
      [TwitchDataSourceReturn.FOLLOWERS]: "followers",
      [TwitchDataSourceReturn.VIEWERS]: "views",
    };

    displayName.push(display[dataSource.options.return]);

    const displayNameString = displayName.join(" ");

    return (
      displayNameString.charAt(0).toUpperCase() + displayNameString.slice(1)
    );
  },
  dataSource: { id: DataSourceId.TWITCH },
  keywords: ["Twitch", "follower", "view", "channel"],
};
const memeratorDataSourceMetadata: DataSourceMetadata<DataSourceMemerator> = {
  icon: FerrisWheelIcon,
  description:
    "Fetch the follower count and meme count for a Memerator account.",
  displayName: (dataSource: DataSourceMemerator) => {
    if (!dataSource.options || typeof dataSource.options.return !== "number")
      return "Memerator";

    const displayName = ["memerator"];

    const display = {
      [MemeratorDataSourceReturn.MEMES]: "memes",
      [MemeratorDataSourceReturn.FOLLOWERS]: "followers",
    };

    displayName.push(display[dataSource.options.return]);

    const displayNameString = displayName.join(" ");

    return (
      displayNameString.charAt(0).toUpperCase() + displayNameString.slice(1)
    );
  },
  dataSource: { id: DataSourceId.MEMERATOR },
  keywords: ["Memerator", "follower", "meme"],
};
const countdownDataSourceMetadata: DataSourceMetadata<DataSourceCountdown> = {
  icon: HourglassIcon,
  description: "Create a countdown timer with a format tailored to your needs.",
  displayName: (dataSource: DataSourceCountdown) => {
    if (!dataSource.options || typeof dataSource.options.date !== "number")
      return "Countdown";
    return "Countdown to " + new Date(dataSource.options.date).toLocaleString();
  },
  dataSource: { id: DataSourceId.COUNTDOWN },
  keywords: ["countdown", "timer", "format"],
};
const clockDataSourceMetadata: DataSourceMetadata<DataSourceClock> = {
  icon: ClockIcon,
  description: "Display a clock adjusted to your preferred timezone.",
  displayName: (dataSource: DataSourceClock) => {
    if (!dataSource.options || typeof dataSource.options.timezone !== "string")
      return "Clock";
    return "Clock (" + dataSource.options.timezone + ")";
  },
  dataSource: { id: DataSourceId.CLOCK },
  keywords: ["clock", "timezone"],
};
const nitroBoostersDataSourceMetadata: DataSourceMetadata<DataSourceNitroBoosters> =
  {
    icon: PartyPopperIcon,
    description: "Retrieve the count of Nitro boosters for the server.",
    displayName: () => "Nitro Boosters",
    dataSource: { id: DataSourceId.NITRO_BOOSTERS },
    keywords: ["Nitro", "boosters", "server"],
  };
const numberDataSourceMetadata: DataSourceMetadata<DataSourceNumber> = {
  icon: Tally5Icon,
  description: "Apply number formatting to the given number.",
  displayName: (dataSource: DataSourceNumber) => {
    if (!dataSource.options) return "Number";
    else if (
      typeof dataSource.options.number === "object" &&
      "id" in dataSource.options.number
    )
      return (
        getDataSourceMetadata(dataSource.options.number.id).displayName(
          dataSource.options.number,
        ) + " as number"
      );
    else return "Number (" + dataSource.options.number + ")";
  },
  dataSource: { id: DataSourceId.NUMBER },
  keywords: ["number", "formatting"],
};
const redditDataSourceMetadata: DataSourceMetadata<DataSourceReddit> = {
  icon: CakeSliceIcon,
  description:
    "Retrieve the title of a subreddit along with the total number of members and the count of members currently online.",
  displayName: (dataSource: DataSourceReddit) => {
    if (!dataSource.options || typeof dataSource.options.return !== "number")
      return "Reddit";

    const displayName = ["subreddit"];

    const display = {
      [RedditDataSourceReturn.MEMBERS]: "members",
      [RedditDataSourceReturn.MEMBERS_ONLINE]: "members online",
      [RedditDataSourceReturn.TITLE]: "title",
    };

    displayName.push(display[dataSource.options.return]);

    const displayNameString = displayName.join(" ");

    return (
      displayNameString.charAt(0).toUpperCase() + displayNameString.slice(1)
    );
  },
  dataSource: { id: DataSourceId.REDDIT },
  keywords: ["Reddit", "subreddit", "members", "online"],
};
const httpDataSourceMetadata: DataSourceMetadata<DataSourceHTTP> = {
  icon: LinkIcon,
  description:
    "Send a GET request to an endpoint and provide the result to this bot.",
  displayName: (dataSource: DataSourceHTTP) => {
    const displayName = ["HTTP"];

    try {
      if (typeof dataSource.options?.url === "string")
        displayName.push(new URL(dataSource.options.url).hostname);
    } catch {
      /* empty */
    }

    const displayNameString = displayName.join(" ");

    return (
      displayNameString.charAt(0).toUpperCase() + displayNameString.slice(1)
    );
  },
  dataSource: { id: DataSourceId.HTTP },
  keywords: ["HTTP", "GET", "request", "endpoint", "API", "fetch"],
};
const channelDataSourceMetadata: DataSourceMetadata<DataSourceChannels> = {
  icon: HashIcon,
  description:
    "Count the number of channels within specified categories or overall.",
  displayName: (dataSource: DataSourceChannels) => {
    if (!dataSource.options?.categories?.length) return "Channels";
    return "Channels under a category";
  },
  dataSource: { id: DataSourceId.CHANNELS },
  keywords: ["channels", "categories"],
};
const replaceDataSourceMetadata: DataSourceMetadata<DataSourceReplace> = {
  icon: ReplaceIcon,
  description:
    "Text replacement, useful in conjunction with other nested counters for comprehensive text modification.",
  displayName: (dataSource: DataSourceReplace) => {
    if (!dataSource.options?.replacements?.length) return "Replace text";

    const displayName = ["replace"];

    displayName.push(
      dataSource.options.replacements
        .map(({ replacement, search }) => {
          if (!replacement || !search) return;
          if (typeof replacement !== "string" || typeof search !== "string")
            return;
          return `"${search}" by "${replacement}"`;
        })
        .filter(Boolean)
        .join(", "),
    );

    if (displayName.length === 1) displayName.push("text");

    const displayNameString = displayName.join(" ");

    return (
      displayNameString.charAt(0).toUpperCase() + displayNameString.slice(1)
    );
  },
  dataSource: { id: DataSourceId.REPLACE },
  keywords: ["text", "replacement", "modification", "string", "substring"],
};

const roleDataSourceMetadata: DataSourceMetadata<DataSourceRoles> = {
  icon: TagsIcon,
  description: "Count all roles present in the server.",
  displayName: () => "Roles",
  dataSource: { id: DataSourceId.ROLES },
  keywords: ["roles"],
};

const botStatsDataSourceMetadata: DataSourceMetadata<DataSourceBotStats> = {
  icon: BotIcon,
  description:
    "Return the total number of users and servers the bot is currently in. (You don't need this)",
  displayName: () => "Bot stats",
  dataSource: { id: DataSourceId.BOT_STATS },
  keywords: [],
};

const unknownDataSourceMetadata: DataSourceMetadata<DataSourceUnknown> = {
  icon: HelpCircleIcon,
  description: "Unkown counter. This is probably due to an error.",
  displayName: () => "Unknown",
  dataSource: { id: DataSourceId.UNKNOWN },
  keywords: [],
  hidden: true,
};

export function dataSourcesMetadataFactory(
  t: TFunction,
): Record<string, DataSourceMetadata> {
  return Object.fromEntries(
    [new DataSourceMetadataMath(t)]
      .map((metadata) => {
        metadata.dataSource = Object.freeze(metadata.dataSource);
        return metadata;
      })
      .map((metatdata) => [metatdata.dataSource.id, metatdata]),
  );
}

export function getDataSourceMetadata(
  id: DataSourceId,
  t: TFunction,
): DataSourceMetadata {
  const metadata = dataSourcesMetadataFactory(t)[id];
  if (!metadata) return getDataSourceMetadata(DataSourceId.UNKNOWN, t);
  return metadata;
}

export function useDataSourceMetadata(id: DataSourceId): DataSourceMetadata {
  const { t } = useTranslation();
  const metadata = useMemo(() => getDataSourceMetadata(id, t), [id, t]);
  return metadata;
}

export function useSearcheableDataSources(): Searchable<DataSource>[] {
  const { t } = useTranslation();
  const searcheableDataSources = useMemo(
    () =>
      Object.values(dataSourcesMetadataFactory(t)).map((i) => ({
        value: i.dataSource,
        keywords: i.keywords,
      })),
    [t],
  );

  return searcheableDataSources;
}

export const useKnownSearcheableDataSources = () => {
  const searcheableDataSources = useSearcheableDataSources();
  return searcheableDataSources.filter(
    (d) => d.value.id !== DataSourceId.UNKNOWN,
  );
};
