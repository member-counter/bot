import type {
  DataSourceMath,
  DataSourceMemerator,
} from "@mc/common/DataSource";
import type { i18n, TFunction } from "i18next";
import { CalculatorIcon, FerrisWheelIcon } from "lucide-react";

import {
  DataSourceId,
  MathDataSourceOperation,
  MemeratorDataSourceReturn,
} from "@mc/common/DataSource";

import { capitalize } from "~/other/capitalize";
import {
  createDataSourceMetadata,
  DataSourceMetadata,
} from "./createDataSourceMetadata";

const MemeratorReturnTKey = {
  [MemeratorDataSourceReturn.FOLLOWERS]: "followers",
  [MemeratorDataSourceReturn.MEMES]: "memes",
} as const;

export const createDataSourceMetadataMemerator = (i18n: i18n) =>
  createDataSourceMetadata<"memerator", DataSourceMemerator>({
    dataSource: { id: DataSourceId.MEMERATOR },
    preTKey: "memerator",
    icon: FerrisWheelIcon,
    i18n,
    displayName(dataSource, t) {
      if (!dataSource.options || typeof dataSource.options.return !== "number")
        return t("name");

      return t("display.syntax", {
        returnKind: t(
          `display.returnKind.${MemeratorReturnTKey[dataSource.options.return]}`,
        ),
      });
    },
  });
