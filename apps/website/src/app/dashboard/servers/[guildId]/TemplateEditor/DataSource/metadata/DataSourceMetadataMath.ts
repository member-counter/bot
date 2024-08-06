import type { i18n } from "i18next";
import { CalculatorIcon } from "lucide-react";

import { DataSourceId, MathDataSourceOperation } from "@mc/common/DataSource";

import { createDataSourceMetadata } from "./createDataSourceMetadata";

const MathOpSigns = {
  [MathDataSourceOperation.ADD]: "+",
  [MathDataSourceOperation.SUBTRACT]: "-",
  [MathDataSourceOperation.MULTIPLY]: "x",
  [MathDataSourceOperation.DIVIDE]: "/",
  [MathDataSourceOperation.MODULO]: "%",
};

const MathOpTKey = {
  [MathDataSourceOperation.ADD]: "add",
  [MathDataSourceOperation.SUBTRACT]: "subtract",
  [MathDataSourceOperation.MULTIPLY]: "multiply",
  [MathDataSourceOperation.DIVIDE]: "divide",
  [MathDataSourceOperation.MODULO]: "modulo",
} as const;

export const createDataSourceMetadataMath = (i18n: i18n) =>
  createDataSourceMetadata({
    dataSourceId: DataSourceId.MATH,
    tKeyName: "math",
    icon: CalculatorIcon,
    i18n,
    displayName(dataSource, t) {
      if (
        !dataSource.options ||
        typeof dataSource.options.operation !== "number"
      )
        return t("name");

      const numbersJoined = dataSource.options.numbers
        ?.filter((n) => typeof n === "number")
        .join(MathOpSigns[dataSource.options.operation]);

      let nonDisplayableNumbers = 0;
      for (const number of dataSource.options.numbers ?? []) {
        if (typeof number !== "number") nonDisplayableNumbers++;
      }

      return t("display.syntax", {
        numbers: numbersJoined,
        operationType: t(
          `display.operationType.${MathOpTKey[dataSource.options.operation]}`,
        ),
        undisplayableNumbers: nonDisplayableNumbers
          ? t("display.undisplayableNumbers", {
              amount: nonDisplayableNumbers,
            })
          : "",
      });
    },
  });
