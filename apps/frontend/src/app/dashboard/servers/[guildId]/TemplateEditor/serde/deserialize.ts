import type { DataSource } from "@mc/common/DataSource";
import type { Grammar, Token, TokenStream } from "prismjs";
import type { Descendant } from "slate";
import Prism from "prismjs";
import { v4 } from "uuid";

import type { Marks } from "../custom-types";
import type { GuildEmoji } from "../d-types";
import type { DataSourceRefId } from "../utils";

function extractDataSource(content: TokenStream): DataSource {
  if (!(content instanceof Array))
    throw new Error(
      "Invalid parsed data source (token content is not an array)",
    );

  const extractedDataSource = content.find(
    (token) => typeof token === "object" && token.type !== "punctuation",
  );

  if (!extractedDataSource)
    throw new Error(
      "Invalid parsed data source (token content does not contain a data source)",
    );

  const unparsedDataSource: string =
    typeof extractedDataSource === "string"
      ? extractedDataSource
      : (extractedDataSource.content as string); // it can't be anything else despite types saying otherwise

  return JSON.parse(unparsedDataSource) as DataSource;
}

function extractEmoji(tokens: TokenStream): string | GuildEmoji {
  if (!(tokens instanceof Array))
    throw new Error("Invalid parsed emoji (token content is not an array)");

  const animated =
    (
      tokens.find(
        (token) => typeof token === "object" && token.type === "animated",
      ) as Token | undefined
    )?.content === "a";

  const name = (
    tokens.find(
      (token) => typeof token === "object" && token.type === "name",
    ) as Token
  ).content as string;

  const id = (
    tokens.find((token) => typeof token === "object" && token.type === "id") as
      | Token
      | undefined
  )?.content as string | undefined;

  if (!id) {
    return name;
  } else {
    return { name, id, animated };
  }
}

function extractMention(tokens: TokenStream): string {
  if (!(tokens instanceof Array))
    throw new Error("Invalid parsed mention (token content is not an array)");

  const id = (
    tokens.find(
      (token) => typeof token === "object" && token.type === "id",
    ) as Token
  ).content as string;

  return id;
}

function transformTokens(tokens: TokenStream): {
  nodes: Descendant[];
  dataSourceRefs: Map<DataSourceRefId, DataSource>;
} {
  const dataSourceRefs = new Map<DataSourceRefId, DataSource>();

  function transformToken(
    token: TokenStream,
    formatting: Partial<Record<Marks, boolean>>,
  ): Descendant[] {
    if (token instanceof Array)
      return token.flatMap((token) => transformToken(token, formatting));
    if (typeof token === "string") return [{ text: token, ...formatting }];

    if (
      ["bold", "italic", "underline", "strike", "spoiler"].includes(token.type)
    ) {
      return transformToken(token.content, {
        ...formatting,
        [token.type]: true,
      });
    }

    if (token.type === "content") {
      return transformToken(token.content, { ...formatting });
    }

    if (token.type === "dataSource") {
      const dataSourceRefId = v4();
      const dataSource = extractDataSource(token.content);

      dataSourceRefs.set(dataSourceRefId, dataSource);

      return [
        {
          type: "dataSource",
          dataSourceRefId,
          children: [{ text: "", ...formatting }],
        },
      ];
    }

    if (token.type === "emoji") {
      return [
        {
          type: "emoji",
          emoji: extractEmoji(token.content),
          children: [{ text: "", ...formatting }],
        },
      ];
    }

    if (token.type === "channel") {
      return [
        {
          type: "mention",
          channel: extractMention(token.content),
          children: [{ text: "", ...formatting }],
        },
      ];
    }

    if (token.type === "role") {
      return [
        {
          type: "mention",
          role: extractMention(token.content),
          children: [{ text: "", ...formatting }],
        },
      ];
    }

    return [{ text: "", ...formatting }];
  }

  const nodes = transformToken(tokens, {});
  return { nodes, dataSourceRefs };
}

export function deserialize(input: string, grammar: Grammar) {
  const tokens = Prism.tokenize(input, grammar);
  const { nodes: transformedTokens, dataSourceRefs } = transformTokens(tokens);

  const children = transformedTokens.filter(
    (node) => !("text" in node && node.text === ""),
  );

  // There must be always one empty text node, and always one at the end
  children.push({ text: "" });

  const nodes: Descendant[] = [
    {
      type: "paragraph",
      children,
    },
  ];

  return { nodes, dataSourceRefs };
}
