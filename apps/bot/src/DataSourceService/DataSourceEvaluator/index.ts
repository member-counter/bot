import type {
  DataSourceFormatSettings,
  DataSourceId,
} from "@mc/common/DataSource";
import type { GuildSettings } from "@mc/common/GuildSettings";
import type { Guild } from "discord.js";

import type { initI18n } from "~/i18n";

export interface DataSourceContext {
  guild: Guild;
  guildSettings: Awaited<ReturnType<typeof GuildSettings.get>>;
  i18n: Awaited<ReturnType<typeof initI18n>>;
}

export interface DataSourceExecuteArgs<EO> {
  ctx: DataSourceContext;
  format: DataSourceFormatSettings;
  options?: EO;
}

export type DataSourceExecuteResult = number | string;

export type DataSourceExecuteFunction<EO> = (
  executeArgs: DataSourceExecuteArgs<EO>,
) => Promise<DataSourceExecuteResult>;

export interface DataSourceConstructorArgs<EO> {
  id: DataSourceId;
  execute: DataSourceExecuteFunction<EO>;
}

export class DataSourceEvaluator<ExecuteOptions = Record<string, unknown>> {
  public id: DataSourceId;
  public execute: DataSourceExecuteFunction<ExecuteOptions>;
  constructor(args: DataSourceEvaluator<ExecuteOptions>) {
    this.id = args.id;
    this.execute = args.execute;
  }
}
