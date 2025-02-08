import type { DataSource } from "@mc/common/DataSource";
import type { JSX } from "react";
import React from "react";

import { DataSourceId } from "@mc/common/DataSource";

import { useDataSourceMetadata } from "../metadata";
import { BotStatsOptions } from "./Pages/BotStatsOptions";
import { ChannelOptions } from "./Pages/ChannelsOptions";
import { ClockOptions } from "./Pages/ClockOptions";
import { ConcatOptions } from "./Pages/ConcatOptions";
import { CountdownOptions } from "./Pages/CountdownOptions";
import { GameOptions } from "./Pages/GameOptions";
import { HttpOptions } from "./Pages/HttpOptions";
import { MathOptions } from "./Pages/MathOptions";
import { MembersOptions } from "./Pages/MembersOptions";
import { MemeratorOptions } from "./Pages/MemeratorOptions";
import { NumberOptions } from "./Pages/NumberOptions";
import { RedditOptions } from "./Pages/RedditOptions";
import { ReplaceOptions } from "./Pages/ReplaceOptions";
import { TwitchOptions } from "./Pages/TwitchOptions";
import { YouTubeOptions } from "./Pages/YouTubeOptions";

const optionsMap = {
  [DataSourceId.MEMBERS.toString()]: MembersOptions,
  [DataSourceId.MATH.toString()]: MathOptions,
  [DataSourceId.CONCAT.toString()]: ConcatOptions,
  [DataSourceId.GAME.toString()]: GameOptions,
  [DataSourceId.CLOCK.toString()]: ClockOptions,
  [DataSourceId.COUNTDOWN.toString()]: CountdownOptions,
  [DataSourceId.TWITCH.toString()]: TwitchOptions,
  [DataSourceId.YOUTUBE.toString()]: YouTubeOptions,
  [DataSourceId.REDDIT.toString()]: RedditOptions,
  [DataSourceId.HTTP.toString()]: HttpOptions,
  [DataSourceId.NUMBER.toString()]: NumberOptions,
  [DataSourceId.REPLACE.toString()]: ReplaceOptions,
  [DataSourceId.MEMERATOR.toString()]: MemeratorOptions,
  [DataSourceId.BOT_STATS.toString()]: BotStatsOptions,
  [DataSourceId.CHANNELS.toString()]: ChannelOptions,
} as const;

export interface EditDataSourceProps {
  dataSource: DataSource;
  onChangeDataSource: (dataSource: DataSource) => void;
}

export function EditDataSourceOptions({
  dataSource,
  onChangeDataSource,
}: EditDataSourceProps): JSX.Element {
  const metadata = useDataSourceMetadata(dataSource.id);

  const Options = optionsMap[dataSource.id.toString()];

  if (!Options) return <p className="p-2 text-sm">{metadata.description}</p>;

  return (
    <div className="[&>*>*]:flex [&>*>*]:flex-col [&>*>*]:gap-3 [&>*]:flex [&>*]:flex-col [&>*]:gap-5">
      {
        <Options
          options={dataSource.options as never}
          onOptionsChange={(options) => {
            onChangeDataSource({ ...dataSource, options } as never);
          }}
        />
      }
    </div>
  );
}
