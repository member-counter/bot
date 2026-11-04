import type { DataSource } from "@mc/common/DataSource";
import type { KnownErrorType } from "@mc/common/KnownError/index";

import { DATA_SOURCE_DELIMITER } from "@mc/common/DataSource";
import { LruMap } from "@mc/common/LruMap";

// Many guilds use the same templates (the defaults of the setup command), so
// keep the compiled templates in a cache. A changed template is a new key, so
// the cache never needs invalidation. Limit the number of kept templates. A
// shard of about 2900 guilds uses a few hundred different templates.
const MAX_COMPILED_TEMPLATES = 2_500;

// Do not keep longer templates in the cache. Anyone can send a template to
// the live preview, so without this limit the cache can hold many large
// templates. A cached template of this length uses about 20 KB with its key,
// so a full cache uses at most about 50 MB. Most templates are much shorter.
const MAX_CACHED_TEMPLATE_LENGTH = 2_048;

// The walk stops after this number of steps, and the template fails.
const MAX_WALK_ITERATIONS = 50_000;

/**
 * A data source part of a template, parsed one time. Evaluation never changes
 * it: the parsed tree is frozen.
 */
export interface CompiledDataSource {
  /** The parsed data source. It is the root of the tree. */
  root: DataSource;
  /**
   * The nodes to execute, in execution order. A nested data source comes
   * before the data source that contains it.
   */
  executionOrder: readonly object[];
  /**
   * The objects that contain a node to execute. Evaluation copies these
   * objects and puts the results in the copies. It shares all other objects.
   */
  containers: ReadonlySet<object>;
  /** True when the walk stopped at MAX_WALK_ITERATIONS. */
  isTooComplex: boolean;
}

/**
 * A compiled data source, or the error of a text that is not a valid data
 * source. Evaluation throws that error at the position of the part in the
 * template.
 */
export type CompiledDataSourcePart =
  | { compiled: CompiledDataSource; errorType: null }
  | { compiled: null; errorType: KnownErrorType };

/** Text parts and data source parts, in template order. */
export type CompiledTemplate = readonly (string | CompiledDataSourcePart)[];

function deepFreeze(value: unknown) {
  if (typeof value !== "object" || value === null || Object.isFrozen(value)) {
    return;
  }
  Object.freeze(value);
  for (const child of Object.values(value)) deepFreeze(child);
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const hasOwn = (value: object, key: string) =>
  Object.prototype.hasOwnProperty.call(value, key);

/**
 * Find the nodes to execute and their order: depth first, the last child first.
 */
function planExecution(root: DataSource) {
  interface Item {
    node: Record<string, unknown>;
    isExplored: boolean;
  }

  const executionOrder: object[] = [];
  const containers = new Set<object>();
  const parents = new Map<object, object>();
  const queue: Item[] = [
    { node: root as unknown as Record<string, unknown>, isExplored: false },
  ];

  let iterationsLeft = MAX_WALK_ITERATIONS;
  while (--iterationsLeft) {
    const item = queue.pop();
    if (!item) break;

    const children: Item[] = [];
    if (!item.isExplored) {
      item.isExplored = true;
      for (const key in item.node) {
        const child = item.node[key];
        if (isObject(child) && hasOwn(item.node, key)) {
          children.push({ node: child, isExplored: false });
          parents.set(child, item.node);
        }
      }
    }

    if (children.length) {
      queue.push(item, ...children);
      continue;
    }

    if (hasOwn(item.node, "id")) {
      executionOrder.push(item.node);
      // The result replaces this node in its parent, so all its ancestors
      // need a copy at evaluation time.
      let parent = parents.get(item.node);
      while (parent && !containers.has(parent)) {
        containers.add(parent);
        parent = parents.get(parent);
      }
    }
  }

  return { executionOrder, containers, isTooComplex: iterationsLeft === 0 };
}

function compileDataSource(raw: string): CompiledDataSourcePart {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      compiled: null,
      errorType: "DELIMITED_DATA_SOURCE_IS_ILLEGAL_JSON",
    };
  }

  // A data source is an object with an id. This also refuses JSON values
  // that are not objects, such as null or a number.
  if (!isObject(parsed) || !hasOwn(parsed, "id")) {
    return { compiled: null, errorType: "DELIMITED_DATA_SOURCE_IS_INVALID" };
  }

  const root = parsed as unknown as DataSource;
  deepFreeze(root);
  return { compiled: { root, ...planExecution(root) }, errorType: null };
}

function compileTemplate(template: string): CompiledTemplate {
  return template
    .split(DATA_SOURCE_DELIMITER)
    .map((part, i) => (i % 2 === 0 ? part : compileDataSource(part)));
}

const compiledTemplates = new LruMap<string, CompiledTemplate>(
  MAX_COMPILED_TEMPLATES,
);

/**
 * Return the compiled template from the cache, or compile and keep it. A
 * template longer than MAX_CACHED_TEMPLATE_LENGTH is compiled each time.
 */
export function getCompiledTemplate(template: string): CompiledTemplate {
  if (template.length > MAX_CACHED_TEMPLATE_LENGTH) {
    return compileTemplate(template);
  }

  let compiled = compiledTemplates.get(template);

  if (!compiled) {
    compiled = compileTemplate(template);
    compiledTemplates.set(template, compiled);
  }

  return compiled;
}

/**
 * Return the value with the results of executed nodes in place of those
 * nodes. Only containers are copied. All other objects are returned as they
 * are, and they are frozen.
 */
export function resolveValue(
  value: unknown,
  compiled: CompiledDataSource,
  results: ReadonlyMap<object, unknown>,
): unknown {
  if (!isObject(value)) return value;
  if (results.has(value)) return results.get(value);
  if (!compiled.containers.has(value)) return value;

  if (Array.isArray(value)) {
    return value.map((item) => resolveValue(item, compiled, results));
  }

  // Object.fromEntries creates own properties for all keys, also for a
  // "__proto__" key, the same as JSON.parse.
  return Object.fromEntries(
    Object.keys(value).map((key) => [
      key,
      resolveValue(value[key], compiled, results),
    ]),
  );
}
