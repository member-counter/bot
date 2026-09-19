/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import assert from "assert";
import type { DataSource, DataSourceId } from "@mc/common/DataSource";

import { isTextLikeChannel } from "@mc/common/channelType";
import { DATA_SOURCE_DELIMITER } from "@mc/common/DataSource";
import { KnownError } from "@mc/common/KnownError/index";

import type {
  DataSourceContext,
  DataSourceExecuteResult,
  PreparedDataSourceFormatSettings,
} from "./DataSourceEvaluator";
import dataSourceEvaluators from "./DataSourceEvaluator/evaluators";
import { ExplorerStackItem } from "./ExplorerStackItem";
import { FallbackUsedError } from "./FallbackUsedError";

class DataSourceService {
  private static dataSourceEvaluators = Object.fromEntries(
    dataSourceEvaluators.map((dataSourceEvaluator) => [
      dataSourceEvaluator.id,
      dataSourceEvaluator,
    ]),
  );

  constructor(private ctx: DataSourceContext) {}

  public async evaluateTemplate(
    template: string,
  ): Promise<{ result: string; nonFatalErrors: Error[] }> {
    const nonFatalErrors: Error[] = [];
    const parts = template.split(DATA_SOURCE_DELIMITER);
    let result = "";

    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        result += parts[i];
      } else {
        const dataSourcePart = parts[i];
        assert(typeof dataSourcePart === "string", "expected string");

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new KnownError("EVALUATION_TIMEOUT")),
            60_000,
          ),
        );

        result += await Promise.race([
          this.evaluateDataSource(dataSourcePart, nonFatalErrors),
          timeoutPromise,
        ]);
      }
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
    unparsedRawDataSource: string,
    nonFatalErrors: Error[],
  ): Promise<string> {
    const dataSource = this.parseRawDataSource(unparsedRawDataSource);

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

    const result = await this.exploreAndExecute(
      dataSource,
      formatSettings,
      nonFatalErrors,
    );

    assert(
      typeof result === "number" || typeof result === "string",
      new KnownError("UNKNOWN_EVALUATION_RETURN_TYPE"),
    );

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
      result = new Intl.NumberFormat(locale, {
        notation: "compact",
      }).format(result);
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

  private async exploreAndExecute(
    rawDataSource: DataSource,
    formatSettings: PreparedDataSourceFormatSettings,
    nonFatalErrors: Error[],
  ): Promise<unknown> {
    const rootItem = new ExplorerStackItem({ root: rawDataSource }, "root");
    const queue: ExplorerStackItem[] = [rootItem];

    let iterationsLeft = 50_000;
    while (--iterationsLeft) {
      const toExploreMore: ExplorerStackItem[] = [];
      const item = queue.pop();
      if (!item) break;

      if (!item.explored) {
        item.explored = true;
        for (const childKey in item.node) {
          const childIsObject =
            typeof item.node[childKey] === "object" &&
            item.node[childKey] !== null;
          if (
            childIsObject &&
            Object.prototype.hasOwnProperty.call(item.node, childKey)
          ) {
            toExploreMore.push(new ExplorerStackItem(item.node, childKey));
          }
        }
      }

      if (!toExploreMore.length) {
        const nodeIsADataSource = Object.prototype.hasOwnProperty.call(
          item.node,
          "id",
        );
        if (nodeIsADataSource) {
          item.node = await this.executeDataSource(
            {
              ...item.node,
              format: formatSettings,
            },
            nonFatalErrors,
          );
        }
      } else {
        queue.push(item, ...toExploreMore);
      }
    }

    if (!iterationsLeft) {
      throw new Error(
        `Max iterations (${iterationsLeft}) reached for ${JSON.stringify(rawDataSource)}`,
      );
    }

    return rootItem.node as unknown;
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
  ): Promise<DataSourceExecuteResult> {
    const dataSourceEvaluator = DataSourceService.dataSourceEvaluators[id];

    assert(dataSourceEvaluator, new KnownError("UNKNOWN_DATA_SOURCE"));

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
      });
    } catch (error) {
      if (error instanceof FallbackUsedError) {
        nonFatalErrors.push(error.cause);
        return error.fallback;
      }
      throw error;
    }
  }

  private parseRawDataSource(unparsedRawDataSource: string): DataSource {
    let parsed: DataSource;

    try {
      parsed = JSON.parse(unparsedRawDataSource) as DataSource;
    } catch {
      throw new KnownError("DELIMITED_DATA_SOURCE_IS_ILLEGAL_JSON");
    }

    if (!Object.prototype.hasOwnProperty.call(parsed, "id"))
      throw new KnownError("DELIMITED_DATA_SOURCE_IS_INVALID");

    return parsed;
  }
}

export default DataSourceService;
