import type ConvertCounter from "../types/ConvertCounter";
import { DataSourceId, MathDataSourceOperation } from "../types/DataSource";
import { toNumber } from "../wrappers";

const Math: ConvertCounter = {
  aliases: [
    "add",
    "sum",
    "sub",
    "subtract",
    "mult",
    "multiply",
    "div",
    "divide",
    "mod",
    "modulus",
  ],
  convert: ({ args, aliasUsed, format }) => {
    const numbers = args[0]?.map((n) => toNumber(n));

    const opAliases = {
      [MathDataSourceOperation.ADD]: ["add", "sum"],
      [MathDataSourceOperation.SUBTRACT]: ["sub", "subtract"],
      [MathDataSourceOperation.MULTIPLY]: ["mult", "multiply"],
      [MathDataSourceOperation.DIVIDE]: ["div", "divide"],
      [MathDataSourceOperation.MODULO]: ["mod", "modulus"],
    };

    const operation: MathDataSourceOperation = Number(
      Object.entries(opAliases).find(([_, aliases]) =>
        aliases.includes(aliasUsed),
      )?.[0],
    ) as unknown as MathDataSourceOperation;

    return {
      id: DataSourceId.MATH,
      format,
      options: {
        numbers,
        operation,
      },
    };
  },
};

export default Math;
