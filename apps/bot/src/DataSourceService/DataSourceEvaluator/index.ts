import type {
  DataSource,
  DataSourceFormatSettings,
  DataSourceId,
} from "@mc/common/DataSource";
import type { GuildSettings } from "@mc/common/GuildSettings";
import type { ChannelType, Guild } from "discord.js";

import type { DeepExclude, DeepNonNullable } from "~/@types/utils";
import type { initI18n } from "~/i18n";

export interface DataSourceContext {
  channelType: ChannelType;
  guild: Guild;
  guildSettings: Awaited<ReturnType<typeof GuildSettings.get>>;
  i18n: Awaited<ReturnType<typeof initI18n>>;
}

export type PreparedDataSourceFormatSettings = DeepNonNullable<Required<DataSourceFormatSettings>>;

export interface DataSourceExecuteArgs<O> {
  ctx: DataSourceContext;
  format: PreparedDataSourceFormatSettings;
  options: DeepExclude<O, DataSource>;
}

export type DataSourceExecuteResult = number | string;

export type DataSourceExecuteFunction<O> = (
  executeArgs: DataSourceExecuteArgs<O>,
) => Promise<DataSourceExecuteResult> | DataSourceExecuteResult;

export class DataSourceEvaluator<
  Id extends DataSourceId = DataSourceId,
  DataSourceOptions = NonNullable<(DataSource & { id: Id })["options"]>,
> {
  public id: Id;
  public execute: DataSourceExecuteFunction<DataSourceOptions>;
  constructor(args: DataSourceEvaluator<Id, DataSourceOptions>) {
    this.id = args.id;
    this.execute = args.execute;
  }
}
