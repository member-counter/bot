import type { DataSource } from "./DataSource";
import type { OldCounter } from "./OldCounter";

export type OldFormatToken =
  | { type: "string"; value: string }
  | { type: "counter_delimiter"; value: "{" | "}" }
  | { type: "counter_section"; value: string }
  | { type: "counter_section_delimiter" }
  | { type: "counter_section_arg_item_delimiter" };

export type OldFormatAST = StringNode | OldCounterNode;

export type NewFormatAST = StringNode | NewCounterNode;

export interface StringNode {
  type: "string";
  content: string;
}

export interface OldCounterNode {
  type: "old_counter";
  // First dimension is the section arg[n], second dimension is arg item arg[n][n], third dimension is for concatenation of multiple token types
  defintion: OldCounter<(OldCounterNode | StringNode)[][][]>;
}

export interface NewCounterNode {
  type: "new_counter";
  defintion: DataSource;
}
