import type { DataSource, DataSourceConcat } from "./types/DataSource";
import { DataSourceId } from "./types/DataSource";

export const toConcat = (
  items: (DataSource | string)[],
  separator?: string | null,
): DataSourceConcat | string => {
  if (items.every((item) => typeof item === "string")) {
    return items.join(separator ?? "");
  }

  return {
    id: DataSourceId.CONCAT,
    options: {
      strings:
        typeof separator === "string"
          ? items.flatMap((element, index) =>
              index < items.length - 1 ? [element, separator] : [element],
            )
          : items,
    },
  };
};

export const toNumber = (number: DataSource | string): DataSource | number => {
  const parsedNumber = Number(number);
  const isValidNumber = !isNaN(parsedNumber);

  if (isValidNumber) {
    return parsedNumber;
  } else {
    return {
      id: DataSourceId.NUMBER,
      options: {
        number: number,
      },
    };
  }
};
