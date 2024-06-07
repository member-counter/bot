import type {
  DataSourceFormatSettings,
  DataSourceId,
} from "@mc/common/DataSource";
import type { GuildSettings } from "@mc/common/GuildSettings";

export interface DataSourceCtx {
  guildSettings: GuildSettings;
}

export interface DataSourceExecuteArgs<EO> {
  ctx: DataSourceCtx;
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
