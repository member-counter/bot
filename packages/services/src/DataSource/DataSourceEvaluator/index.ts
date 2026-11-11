import type { DeepExclude, DeepNonNullable } from "@mc/common/@types/utils";
import type {
  DataSource,
  DataSourceFormatSettings,
  DataSourceId,
} from "@mc/common/DataSource";
import type { ChannelType, Guild } from "discord.js";

import type { GuildSettingsService } from "../../guildSettings";
import type { EvaluationScheduler } from "./EvaluationScheduler";

export interface DataSourceContext {
  channelType: ChannelType;
  guild: Guild;
  guildSettings: Awaited<ReturnType<typeof GuildSettingsService.get>>;
}

export type PreparedDataSourceFormatSettings = DeepNonNullable<
  Required<DataSourceFormatSettings>
>;

export interface DataSourceExecuteArgs<O> {
  ctx: DataSourceContext;
  format: PreparedDataSourceFormatSettings;
  options: DeepExclude<O, DataSource>;
  /**
   * An evaluator with a long loop uses it to give the event loop a turn, and
   * to stop when the evaluation is cancelled.
   */
  scheduler: EvaluationScheduler;
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
