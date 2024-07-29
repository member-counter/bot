import type { DataSourceMath } from "@mc/common/DataSource";
import type { TFunction } from "i18next";
import { CalculatorIcon } from "lucide-react";

import { DataSourceId, MathDataSourceOperation } from "@mc/common/DataSource";

import { capitalize } from "~/other/capitalize";
import { DataSourceMetadata } from "./DataSourceMetadata";

export class DataSourceMetadataMath extends DataSourceMetadata<DataSourceMath> {
  dataSource: DataSourceMath = { id: DataSourceId.MATH };
  icon = CalculatorIcon;
  signs: Record<MathDataSourceOperation, [string, string]>;
  constructor(t: TFunction) {
    super(t);
    this.description = t(
      "pages.dashboard.servers.dataSourceMetadata.math.description",
    );
    this.keywords = t(
      "pages.dashboard.servers.dataSourceMetadata.math.keywords",
      { returnObjects: true },
    );
    this.signs = {
      [MathDataSourceOperation.ADD]: [
        this.t(
          "pages.dashboard.servers.dataSourceMetadata.math.display.operationType.add",
        ),
        "+",
      ],
      [MathDataSourceOperation.SUBSTRACT]: [
        this.t(
          "pages.dashboard.servers.dataSourceMetadata.math.display.operationType.substract",
        ),
        "-",
      ],
      [MathDataSourceOperation.MULTIPLY]: [
        this.t(
          "pages.dashboard.servers.dataSourceMetadata.math.display.operationType.multiply",
        ),
        "x",
      ],
      [MathDataSourceOperation.DIVIDE]: [
        this.t(
          "pages.dashboard.servers.dataSourceMetadata.math.display.operationType.divide",
        ),
        "/",
      ],
      [MathDataSourceOperation.MODULO]: [
        this.t(
          "pages.dashboard.servers.dataSourceMetadata.math.display.operationType.modulo",
        ),
        "%",
      ],
    };
  }
  displayName(dataSource: DataSourceMath) {
    if (!dataSource.options || typeof dataSource.options.operation !== "number")
      return this.t("pages.dashboard.servers.dataSourceMetadata.math.name");

    const [signName, signSymbol] = this.signs[dataSource.options.operation];
    const numbersJoined = dataSource.options.numbers?.join(signSymbol);

    let nonDisplayableNumbers = 0;
    for (const number of dataSource.options.numbers ?? []) {
      if (typeof number !== "number") nonDisplayableNumbers++;
    }

    return capitalize(
      this.t("pages.dashboard.servers.dataSourceMetadata.math.display.syntax", {
        numbers: numbersJoined,
        operationType: signName,
        undisplayableNumbers: nonDisplayableNumbers
          ? this.t(
              "pages.dashboard.servers.dataSourceMetadata.math.display.undisplayableNumbers",
              { amount: nonDisplayableNumbers },
            )
          : "",
      }),
    );
  }
}
