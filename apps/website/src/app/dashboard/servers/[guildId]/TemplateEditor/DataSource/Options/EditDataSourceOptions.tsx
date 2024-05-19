import type { DataSource } from "@mc/common/DataSource";
import React, { useMemo } from "react";

import { DataSourceId } from "@mc/common/DataSource";

import { getDataSourceMetadata } from "../dataSourcesMetadata";
import { BotStatsOptions } from "./Pages/BotStatsOptions";
import { ChannelOptions } from "./Pages/ChannelsOptions";
import { ClockOptions } from "./Pages/ClockOptions";
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
import { TwitterOptions } from "./Pages/TwitterOptions";
import { YouTubeOptions } from "./Pages/YouTubeOptions";

export interface EditDataSourceProps {
  dataSource: DataSource;
  onChangeDataSource: (dataSource: DataSource) => void;
}

export function EditDataSourceOptions({
  dataSource,
  onChangeDataSource,
}: EditDataSourceProps): JSX.Element {
  const metadata = useMemo(
    () => getDataSourceMetadata(dataSource.id),
    [dataSource.id],
  );

  return dataSource.id === DataSourceId.MEMBERS ? (
    <MembersOptions
      options={dataSource.options}
      onOptionsChange={(options) => {
        onChangeDataSource({ ...dataSource, options });
      }}
    />
  ) : dataSource.id === DataSourceId.MATH ? (
    <MathOptions
      options={dataSource.options}
      onOptionsChange={(options) => {
        onChangeDataSource({ ...dataSource, options });
      }}
    />
  ) : dataSource.id === DataSourceId.GAME ? (
    <GameOptions
      options={dataSource.options}
      onOptionsChange={(options) => {
        onChangeDataSource({ ...dataSource, options });
      }}
    />
  ) : dataSource.id === DataSourceId.YOUTUBE ? (
    <YouTubeOptions
      options={dataSource.options}
      onOptionsChange={(options) => {
        onChangeDataSource({ ...dataSource, options });
      }}
    />
  ) : dataSource.id === DataSourceId.TWITCH ? (
    <TwitchOptions
      options={dataSource.options}
      onOptionsChange={(options) => {
        onChangeDataSource({ ...dataSource, options });
      }}
    />
  ) : dataSource.id === DataSourceId.TWITTER ? (
    <TwitterOptions
      options={dataSource.options}
      onOptionsChange={(options) => {
        onChangeDataSource({ ...dataSource, options });
      }}
    />
  ) : dataSource.id === DataSourceId.MEMERATOR ? (
    <MemeratorOptions
      options={dataSource.options}
      onOptionsChange={(options) => {
        onChangeDataSource({ ...dataSource, options });
      }}
    />
  ) : dataSource.id === DataSourceId.COUNTDOWN ? (
    <CountdownOptions
      options={dataSource.options}
      onOptionsChange={(options) => {
        onChangeDataSource({ ...dataSource, options });
      }}
    />
  ) : dataSource.id === DataSourceId.CLOCK ? (
    <ClockOptions
      options={dataSource.options}
      onOptionsChange={(options) => {
        onChangeDataSource({ ...dataSource, options });
      }}
    />
  ) : dataSource.id === DataSourceId.NUMBER ? (
    <NumberOptions
      options={dataSource.options}
      onOptionsChange={(options) => {
        onChangeDataSource({ ...dataSource, options });
      }}
    />
  ) : dataSource.id === DataSourceId.REDDIT ? (
    <RedditOptions
      options={dataSource.options}
      onOptionsChange={(options) => {
        onChangeDataSource({ ...dataSource, options });
      }}
    />
  ) : dataSource.id === DataSourceId.HTTP ? (
    <HttpOptions
      options={dataSource.options}
      onOptionsChange={(options) => {
        onChangeDataSource({ ...dataSource, options });
      }}
    />
  ) : dataSource.id === DataSourceId.CHANNELS ? (
    <ChannelOptions
      options={dataSource.options}
      onOptionsChange={(options) => {
        onChangeDataSource({ ...dataSource, options });
      }}
    />
  ) : dataSource.id === DataSourceId.BOT_STATS ? (
    <BotStatsOptions
      options={dataSource.options}
      onOptionsChange={(options) => {
        onChangeDataSource({ ...dataSource, options });
      }}
    />
  ) : dataSource.id === DataSourceId.REPLACE ? (
    <ReplaceOptions
      options={dataSource.options}
      onOptionsChange={(options) => {
        onChangeDataSource({ ...dataSource, options });
      }}
    />
  ) : (
    <p className="p-2 text-sm">{metadata.description}</p>
  );
}
