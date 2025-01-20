import assert from "assert";
import { format } from "util";

import type { DataSource } from "./types/DataSource";
import type { OldFormattingSettings } from "./types/OldCounter";
import type {
  NewCounterNode,
  NewFormatAST,
  OldCounterNode,
  OldFormatAST,
  OldFormatToken,
  StringNode,
} from "./types/transpiler";
import { convertFormatSettings } from "./convertFormatSettings";
import _counters from "./counters/all";
import { getCounterByAlias } from "./getCounterByAlias";
import { safeCounterName } from "./safeCounterName";
import { tryToDecodeOldFormatSettings } from "./tryToDecodeOldFormatSettings";
import { DataSourceId, stringifyDataSoure } from "./types/DataSource";
import { toConcat } from "./wrappers";

function lastCounterIsClosed(tokens: OldFormatToken[]) {
  let pendingClosings = 0;

  for (const token of tokens) {
    if (token.type === "counter_delimiter") {
      if (token.value === "{") {
        pendingClosings++;
      } else {
        pendingClosings--;
      }
    }
  }

  return !pendingClosings;
}

function tokenize(content: string) {
  const tokens: OldFormatToken[] = [];

  let i = 0;
  while (i < content.length) {
    const character = content[i];
    const lastToken = tokens[tokens.length - 1];

    assert(character);

    if (content[i - 1] !== "\\" && (character === "{" || character === "}")) {
      tokens.push({ type: "counter_delimiter", value: character });
      i++;
    } else if (!lastCounterIsClosed(tokens)) {
      if (character === ":") {
        tokens.push({ type: "counter_section_delimiter" });
      } else if (character === ",") {
        tokens.push({ type: "counter_section_arg_item_delimiter" });
      } else {
        lastToken?.type === "counter_section"
          ? (lastToken.value = lastToken.value + character)
          : tokens.push({ type: "counter_section", value: character });
      }
      i++;
    } else {
      lastToken?.type === "string"
        ? (lastToken.value = lastToken.value + character)
        : tokens.push({ type: "string", value: character });
      i++;
    }
  }

  return tokens;
}

function parseCounter(
  tokens: OldFormatToken[],
  currentIndex: number,
): [OldCounterNode, number] {
  currentIndex++;
  let foundName: string | null = null;
  let foundFormat: OldFormattingSettings | null = null;
  const args: (OldCounterNode | StringNode)[][][] = [];

  const getLastArg = () => {
    const lastArg = args[args.length - 1];
    assert(lastArg);
    return lastArg;
  };

  const getLastArgItem = () => {
    const lastArg = getLastArg();
    if (lastArg.length === 0) lastArg.push([]);
    const lastArgItem = lastArg[lastArg.length - 1];
    assert(lastArgItem);
    return lastArgItem;
  };

  for (; currentIndex < tokens.length; currentIndex++) {
    const token = tokens[currentIndex];
    assert(token);
    if (token.type === "counter_delimiter" && token.value === "}") {
      // End of this counter
      break;
    } else if (token.type === "counter_section") {
      if (!foundName) {
        // Attempt to decode base64 or treat as counter name
        const maybeFormat = tryToDecodeOldFormatSettings(token.value);

        if (!foundFormat && maybeFormat) {
          foundFormat = maybeFormat;
        } else {
          foundName = token.value;
        }
      } else {
        // Add section content as an argument
        getLastArgItem().push({
          type: "string",
          content: token.value,
        });
      }
    } else if (token.type === "counter_section_delimiter") {
      if (foundName) {
        // Add a new argument section
        args.push([]);
      }
    } else if (token.type === "counter_section_arg_item_delimiter") {
      // Start a new item within the current argument section
      getLastArg().push([]);
    } else if (token.type === "counter_delimiter" && token.value === "{") {
      // Parse nested counter
      const [nestedCounter, newIndex] = parseCounter(tokens, currentIndex);

      currentIndex = newIndex;
      getLastArgItem().push(nestedCounter);
    } else {
      throw new Error(`Unexpected token: ${format(token)}`);
    }
  }

  return [
    {
      type: "old_counter",
      defintion: {
        format: foundFormat,
        name: foundName ?? "unknown",
        args: args,
      },
    },
    currentIndex,
  ];
}

export function parse(content: string) {
  const tokens = tokenize(content);
  const ast: OldFormatAST[] = [];

  for (let currentIndex = 0; currentIndex < tokens.length; currentIndex++) {
    const token = tokens[currentIndex];
    assert(token);

    if (token.type === "string") {
      assert(token.value);
      ast.push({ type: "string", content: token.value });
    } else if (token.type === "counter_delimiter" && token.value === "{") {
      const [astNode, newIndex] = parseCounter(tokens, currentIndex);

      currentIndex = newIndex;
      ast.push(astNode);
    } else {
      throw new Error(`Unexpected token: ${format(token)}`);
    }
  }

  return ast;
}

function convertOldCounter(node: OldCounterNode): NewCounterNode | StringNode {
  const counterConverter = getCounterByAlias(node.defintion.name);

  if (!counterConverter) {
    return {
      type: "new_counter",
      defintion: {
        id: DataSourceId.UNKNOWN,
      },
    };
  }

  const convertedArgs: (DataSource | string)[][] = node.defintion.args
    .map((arg) =>
      arg.map((uncatenatedItem) =>
        uncatenatedItem.map((item) => {
          if (item.type === "old_counter") {
            const converted = convertOldCounter(item);

            if (converted.type === "new_counter") {
              return converted.defintion;
            } else {
              return converted.content;
            }
          } else {
            return item.content;
          }
        }),
      ),
    )
    .map((arg) =>
      arg.map((item) => {
        const needsConcatenate = item.length > 1;

        if (needsConcatenate) {
          return toConcat(item);
        } else {
          const plainItem = item[0];
          assert(plainItem);

          return plainItem;
        }
      }),
    );

  try {
    return {
      type: "new_counter",
      defintion: counterConverter.convert({
        aliasUsed: safeCounterName(node.defintion.name),
        format: convertFormatSettings(node.defintion.format),
        args: convertedArgs,
      }),
    };
  } catch (err) {
    if (err instanceof SyntaxError) {
      return {
        type: "string",
        content: `[ERROR: ${err.message}]`,
      };
    }

    throw err;
  }
}

function stringifyNewAST(AST: NewFormatAST[]): string {
  let result = "";

  for (const astNode of AST) {
    if (astNode.type === "new_counter") {
      result += stringifyDataSoure(astNode.defintion);
    } else {
      result += astNode.content;
    }
  }

  return result;
}

export function convert(content: string) {
  const oldAST: OldFormatAST[] = parse(content);
  const newAST: NewFormatAST[] = [];

  for (const node of oldAST) {
    if (node.type === "old_counter") {
      const newCounter = convertOldCounter(node);
      newAST.push(newCounter);
    } else {
      newAST.push(node);
    }
  }

  return stringifyNewAST(newAST);
}
