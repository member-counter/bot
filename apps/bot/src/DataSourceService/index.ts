/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import assert from "assert";
import type {
  DataSource,
  DataSourceFormatSettings,
  DataSourceId,
} from "@mc/common/DataSource";
import { z } from "zod";

import { DATA_SOURCE_DELIMITER } from "@mc/common/DataSource";

import type {
  DataSourceCtx,
  DataSourceEvaluator,
  DataSourceExecuteResult,
} from "./DataSourceEvaluator";
import { ExplorerStackItem } from "~/utils/ExplorerStackItem";
import { DataSourceEvaluationError } from "./DataSourceEvaluator/DataSourceEvaluationError";
import dataSourceEvaluators from "./DataSourceEvaluator/evaluators";

class DataSourceService {
  private static dataSourceEvaluators: Record<
    DataSourceId,
    DataSourceEvaluator
  > = Object.fromEntries(
    dataSourceEvaluators.map((counter) => [counter.id, counter]),
  );

  constructor(private ctx: DataSourceCtx) {}

  public async evaluateTemplate(template: string): Promise<string> {
    try {
      const parts = template.split(DATA_SOURCE_DELIMITER);
      let result = "";

      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
          result += parts[i];
        } else {
          const dataSourcePart = parts[i];
          assert(typeof dataSourcePart === "string", "expected string");
          result += await this.evaluateDataSource(dataSourcePart);
        }
      }

      return result;
    } catch (error) {
      console.log(error);

      // TODO catch and translate
      return "unknown error";
    }
  }

  private async evaluateDataSource(
    unparsedRawDataSource: string,
  ): Promise<string> {
    const dataSource = this.parseRawDataSource(unparsedRawDataSource);

    const guildFormatSettings = this.ctx.guildSettings.formatSettings;
    const formatSettings = dataSource.format ?? {};
    formatSettings.compactNotation ??= guildFormatSettings.compactNotation;
    formatSettings.digits ??= guildFormatSettings.digits;
    formatSettings.locale ??= guildFormatSettings.locale;

    const { compactNotation, digits, locale } = formatSettings;

    let result = await this.exploreAndExecute(dataSource, {
      compactNotation,
      digits,
      locale,
    });

    if (!(typeof result === "number" || typeof result === "string")) {
      throw new DataSourceEvaluationError("UNKNOWN_EVALUATION_RETURN_TYPE");
    }

    if (typeof result === "number" && !isNaN(result)) {
      let numericResult: string | number = result;

      const isLocaleEnabled = !locale.includes("disable");
      if (compactNotation || isLocaleEnabled) {
        const options: Intl.NumberFormatOptions = {};

        if (compactNotation) {
          options.notation = "compact";
        }

        numericResult = new Intl.NumberFormat(locale, options).format(result);
      }

      result = numericResult
        .toString()
        .split("")
        .map((digit) => (typeof digit === "number" ? digits[digit] : digit))
        .join("");
    }

    if (typeof result !== "string") {
      throw new DataSourceEvaluationError("FAILED_TO_RETURN_A_FINAL_STRING");
    }

    return result;
  }

  private async exploreAndExecute(
    rawDataSource: DataSource,
    formatSettings: DataSourceFormatSettings,
  ): Promise<unknown> {
    const rootItem = new ExplorerStackItem({ root: rawDataSource }, "root");
    const queue: ExplorerStackItem[] = [rootItem];

    let interationsLeft = 50_000;
    while (--interationsLeft) {
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
          item.node = await this.executeDataSource({
            ...item.node,
            format: formatSettings,
          });
        }
      } else {
        queue.push(item, ...toExploreMore);
      }
    }

    if (!interationsLeft) {
      // TODO report this and given input for debugging
    }

    return rootItem.node as unknown;
  }

  private executeDataSource({
    id,
    format,
    options,
  }: {
    id: number;
    format: DataSourceFormatSettings;
    options: Record<string, unknown>;
  }): Promise<DataSourceExecuteResult> {
    const dataSourceEvaluator = DataSourceService.dataSourceEvaluators[
      id as DataSourceId
    ] as DataSourceEvaluator | undefined;

    assert(
      dataSourceEvaluator,
      new DataSourceEvaluationError("UNKNOWN_DATA_SOURCE"),
    );

    // TODO validate options with zod
    return dataSourceEvaluator.execute({
      format,
      options,
      ctx: this.ctx,
    });
  }

  private parseRawDataSource(
    unparsedRawDataSource: string,
  ): Omit<DataSource, "id"> & { id: number } {
    let parsed: { id: number };

    try {
      parsed = z
        .object({ id: z.number() })
        .parse(JSON.parse(unparsedRawDataSource));
    } catch {
      throw new DataSourceEvaluationError(
        "DELIMITED_DATA_SOURCE_IS_ILLEGAL_JSON",
      );
    }

    if (!Object.prototype.hasOwnProperty.call(parsed, "id"))
      throw new DataSourceEvaluationError("DELIMITED_DATA_SOURCE_IS_INVALID");

    return parsed;
  }
}

export default DataSourceService;
