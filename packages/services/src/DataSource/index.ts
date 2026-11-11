import type { DataSourceId } from "@mc/common/DataSource";

import { isTextLikeChannel } from "@mc/common/channelType";
import { KnownError } from "@mc/common/KnownError/index";
import { LruMap } from "@mc/common/LruMap";

import type {
  CompiledDataSource,
  CompiledDataSourcePart,
} from "./compileTemplate";
import type {
  DataSourceContext,
  DataSourceExecuteResult,
  PreparedDataSourceFormatSettings,
} from "./DataSourceEvaluator";
import { getCompiledTemplate, resolveValue } from "./compileTemplate";
import { EvaluationScheduler } from "./DataSourceEvaluator/EvaluationScheduler";
import dataSourceEvaluators from "./DataSourceEvaluator/evaluators";
import { FallbackUsedError } from "./FallbackUsedError";

class DataSourceService {
  private static dataSourceEvaluators = Object.fromEntries(
    dataSourceEvaluators.map((dataSourceEvaluator) => [
      dataSourceEvaluator.id,
      dataSourceEvaluator,
    ]),
  );

  private static readonly EVALUATION_TIMEOUT_MS = 60_000;

  private static readonly compactFormatters = new LruMap<
    string,
    Intl.NumberFormat
  >(100);

  private static getCompactFormatter(locale: string) {
    let formatter = DataSourceService.compactFormatters.get(locale);

    if (!formatter) {
      // This throws a RangeError for an invalid locale, before the cache
      // changes.
      formatter = new Intl.NumberFormat(locale, { notation: "compact" });
      DataSourceService.compactFormatters.set(locale, formatter);
    }

    return formatter;
  }

  constructor(private ctx: DataSourceContext) {}

  public async evaluateTemplate(
    template: string,
  ): Promise<{ result: string; nonFatalErrors: Error[] }> {
    const nonFatalErrors: Error[] = [];
    let result = "";

    // One timeout for the whole template. It cancels the evaluation: the
    // evaluators stop at their next turn of the event loop, and do not
    // continue to use CPU.
    const cancellation = new AbortController();
    const scheduler = new EvaluationScheduler(cancellation.signal);

    let timeout: NodeJS.Timeout | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeout = setTimeout(() => {
        cancellation.abort();
        reject(new KnownError("EVALUATION_TIMEOUT"));
      }, DataSourceService.EVALUATION_TIMEOUT_MS);
    });
    // A template without data sources never waits for this promise. Handle
    // its rejection, so it can never be an unhandled rejection.
    timeoutPromise.catch(() => undefined);

    try {
      for (const part of getCompiledTemplate(template)) {
        if (typeof part === "string") {
          result += part;
        } else {
          result += await Promise.race([
            this.evaluateDataSource(part, nonFatalErrors, scheduler),
            timeoutPromise,
          ]);
        }
      }
    } finally {
      clearTimeout(timeout);
    }

    result = result.trim();

    if (isTextLikeChannel(this.ctx.channelType)) {
      result = result.slice(0, 1023);
    } else {
      if (result.length < 2)
        throw new KnownError(
          "EVALUATION_RESULT_FOR_CHANNEL_NAME_IS_LESS_THAN_2_CHARACTERS",
        );
      result = result.slice(0, 99);
    }

    return { result, nonFatalErrors };
  }

  private async evaluateDataSource(
    { compiled, errorType }: CompiledDataSourcePart,
    nonFatalErrors: Error[],
    scheduler: EvaluationScheduler,
  ): Promise<string> {
    if (!compiled) throw new KnownError(errorType);

    const dataSource = compiled.root;

    const guildFormatSettings = this.ctx.guildSettings.formatSettings;

    const formatSettings: PreparedDataSourceFormatSettings = {
      locale: dataSource.format?.locale ?? guildFormatSettings.locale,
      compactNotation:
        dataSource.format?.compactNotation ??
        guildFormatSettings.compactNotation,
      digits: new Array(10)
        .fill(null)
        .map((_, i) =>
          dataSource.format?.digits?.[i]?.length
            ? dataSource.format.digits[i]
            : guildFormatSettings.digits[i]?.length
              ? guildFormatSettings.digits[i]
              : i.toString(),
        ),
    };

    const result = await this.executeCompiled(
      compiled,
      formatSettings,
      nonFatalErrors,
      scheduler,
    );

    if (typeof result !== "number" && typeof result !== "string") {
      throw new KnownError("UNKNOWN_EVALUATION_RETURN_TYPE");
    }

    return this.formatDataSourceResult(result, formatSettings);
  }

  private formatDataSourceResult(
    result: string | number,
    { compactNotation, digits, locale }: PreparedDataSourceFormatSettings,
  ): string {
    if (typeof result === "string") {
      return result;
    }

    if (isNaN(result)) {
      throw new KnownError("FAILED_TO_RETURN_A_FINAL_STRING");
    }

    if (compactNotation) {
      result = DataSourceService.getCompactFormatter(locale).format(result);
    }

    if (isTextLikeChannel(this.ctx.channelType)) {
      result = result
        .toString()
        .split("")
        .map((character) => {
          const digit = Number(character);

          if (isNaN(digit)) return character;

          return digits[digit];
        })
        .join("");
    }

    return result.toString();
  }

  /**
   * Execute the data sources of a compiled data source in their execution
   * order. A result replaces its node in the input of the data source that
   * contains it. The compiled data source does not change.
   */
  private async executeCompiled(
    compiled: CompiledDataSource,
    formatSettings: PreparedDataSourceFormatSettings,
    nonFatalErrors: Error[],
    scheduler: EvaluationScheduler,
  ): Promise<unknown> {
    if (compiled.isTooComplex) {
      throw new Error(
        `Max iterations (0) reached for ${JSON.stringify(compiled.root)}`,
      );
    }

    const results = new Map<object, unknown>();

    for (const node of compiled.executionOrder) {
      // Most evaluators are synchronous, so the await below does not give
      // the event loop a turn. Give it one here for templates with many
      // data sources.
      if (scheduler.shouldYield()) await scheduler.yield();

      const input = resolveValue(node, compiled, results) as object;
      results.set(
        node,
        await this.executeDataSource(
          { ...input, format: formatSettings } as Parameters<
            DataSourceService["executeDataSource"]
          >[0],
          nonFatalErrors,
          scheduler,
        ),
      );
    }

    return results.get(compiled.root);
  }

  private async executeDataSource(
    {
      id,
      format,
      options = {},
    }: {
      id: DataSourceId;
      format: PreparedDataSourceFormatSettings;
      options: unknown;
    },
    nonFatalErrors: Error[],
    scheduler: EvaluationScheduler,
  ): Promise<DataSourceExecuteResult> {
    const dataSourceEvaluator = DataSourceService.dataSourceEvaluators[id];

    if (!dataSourceEvaluator) throw new KnownError("UNKNOWN_DATA_SOURCE");

    // Validate locale, default to en-US if invalid (less than 2 characters)
    const validatedFormat = {
      ...format,
      locale: format.locale.length >= 2 ? format.locale : "en-US",
    };

    try {
      return await dataSourceEvaluator.execute({
        format: validatedFormat,
        options: options as never,
        ctx: this.ctx,
        scheduler,
      });
    } catch (error) {
      if (error instanceof FallbackUsedError) {
        nonFatalErrors.push(error.cause);
        return error.fallback;
      }
      throw error;
    }
  }
}

export default DataSourceService;
