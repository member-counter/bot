import type {
  DataSource,
  DataSourceBase,
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
  DataSourceTwitter,
  DataSourceUnknown,
  DataSourceYoutube,
} from "@mc/common/DataSource";
import type { LucideIcon } from "lucide-react";
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
  TwitterIcon,
  UsersIcon,
  YoutubeIcon,
} from "lucide-react";

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

import type { Searchable } from "~/app/components/Combobox";

export interface DataSourceMetadata<D extends DataSource = DataSourceBase> {
  description: string;
  icon: LucideIcon;
  displayName: (dataSource: D) => string;
  dataSource: D;
  keywords: string[];
  hidden?: boolean;
}

const mathDataSourceMetadata: DataSourceMetadata<DataSourceMath> = {
  icon: CalculatorIcon,
  description:
    "Perform math operations like addition, subtraction, multiplication, division, or modulus on a list of numbers.",

  dataSource: { id: DataSourceId.MATH },
  displayName: (dataSource) => {
    if (!dataSource.options || typeof dataSource.options.operation !== "number")
      return "Math";

    const displayName: string[] = [];

    const signs: Record<MathDataSourceOperation, [string, string]> = {
      [MathDataSourceOperation.ADD]: ["add", "+"],
      [MathDataSourceOperation.SUBSTRACT]: ["substract", "-"],
      [MathDataSourceOperation.MULTIPLY]: ["multiply", "x"],
      [MathDataSourceOperation.DIVIDE]: ["divide", "/"],
      [MathDataSourceOperation.MODULO]: ["modulo", "%"],
    };

    displayName.push(signs[dataSource.options.operation][0]);

    if (dataSource.options.numbers) {
      const numbers = [...dataSource.options.numbers].sort((a) =>
        typeof a === "number" ? -1 : 1,
      );

      const displayableNumbers: number[] = [];
      let nonDisplayableNumbers = 0;

      for (const number of numbers) {
        if (typeof number === "number") displayableNumbers.push(number);
        else nonDisplayableNumbers++;
      }

      if (displayableNumbers.length) {
        displayName.push(
          displayableNumbers.join(
            " " + signs[dataSource.options.operation][1] + " ",
          ),
        );

        if (nonDisplayableNumbers > 0) {
          displayName.push("and " + nonDisplayableNumbers + " more");
        }
      }
    }

    const displayNameString = displayName.join(" ");

    return (
      displayNameString.charAt(0).toUpperCase() + displayNameString.slice(1)
    );
  },
  keywords: [
    "math",
    "calculator",
    "operations",
    "numbers",
    "arithmetic",
    "addition",
    "subtraction",
    "multiplication",
    "division",
    "modulus",
  ],
};
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

    if (playing?.length) {
      displayName.push("playing a game");
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
      [TwitchDataSourceReturn.VIEWS]: "views",
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
const twitterDataSourceMetadata: DataSourceMetadata<DataSourceTwitter> = {
  icon: TwitterIcon,
  description: "Fetch the follower count for a X (Twitter) account.",
  displayName: () => "X (Twitter) followers",
  dataSource: { id: DataSourceId.TWITTER },
  keywords: ["x", "Twitter", "follower"],
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
    if (!dataSource.options || typeof dataSource.options.number === "object")
      return "Number";
    return "Number (" + dataSource.options.number + ")";
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
  keywords: ["HTTP", "GET", "request", "endpoint", "API"],
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
          return search + " by " + replacement;
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export const dataSourcesMetadata: Record<string, DataSourceMetadata> =
  Object.fromEntries(
    [
      mathDataSourceMetadata,
      membersDataSourceMetadata,
      gameDataSourceMetadata,
      youtubeDataSourceMetadata,
      twitchDataSourceMetadata,
      twitterDataSourceMetadata,
      memeratorDataSourceMetadata,
      countdownDataSourceMetadata,
      clockDataSourceMetadata,
      nitroBoostersDataSourceMetadata,
      numberDataSourceMetadata,
      redditDataSourceMetadata,
      httpDataSourceMetadata,
      channelDataSourceMetadata,
      replaceDataSourceMetadata,
      roleDataSourceMetadata,
      botStatsDataSourceMetadata,
      unknownDataSourceMetadata,
    ]
      .map((metadata) => {
        metadata.dataSource = Object.freeze(metadata.dataSource);
        return metadata;
      })
      .map((metatdata) => [metatdata.dataSource.id, metatdata]),
  );

export function getDataSourceMetadata(id: DataSourceId): DataSourceMetadata {
  const metadata = dataSourcesMetadata[id];
  if (!metadata) throw new Error("invalid data source id");
  return metadata;
}

export const searcheableDataSources: Searchable<DataSource>[] = Object.values(
  dataSourcesMetadata,
).map((i) => ({
  value: i.dataSource,
  keywords: i.keywords,
}));

export const knownSearcheableDataSources = searcheableDataSources.filter(
  (d) => d.value.id !== DataSourceId.UNKNOWN,
);
