import assert from "node:assert/strict";
import test from "node:test";

import { convert, parse } from "./transpiler";

void test("parse: basic counter with base64 format", () => {
  const input =
    "{eyJzaG9ydE51bWJlciI6bnVsbCwibG9jYWxlIjpudWxsLCJkaWdpdHMiOm51bGx9:add:1,2,3}";
  const result = parse(input);

  assert.deepEqual(result, [
    {
      type: "old_counter",
      defintion: {
        format: { shortNumber: null, locale: null, digits: null },
        name: "add",
        args: [
          [
            [{ type: "string", content: "1" }],
            [{ type: "string", content: "2" }],
            [{ type: "string", content: "3" }],
          ],
        ],
      },
    },
  ]);
});

void test("parse: counter without base64", () => {
  const input = "{http:someurl:cachelifetime}";
  const result = parse(input);

  assert.deepEqual(result, [
    {
      type: "old_counter",
      defintion: {
        format: null,
        name: "http",
        args: [
          [[{ type: "string", content: "someurl" }]],
          [[{ type: "string", content: "cachelifetime" }]],
        ],
      },
    },
  ]);
});

void test("parse: nested counters", () => {
  const input =
    "{eyJzaG9ydE51bWJlciI6bnVsbCwibG9jYWxlIjpudWxsLCJkaWdpdHMiOm51bGx9:add:{static:2}4,5}";
  const result = parse(input);

  assert.deepEqual(result, [
    {
      type: "old_counter",
      defintion: {
        format: { shortNumber: null, locale: null, digits: null },
        name: "add",
        args: [
          [
            [
              {
                type: "old_counter",
                defintion: {
                  format: null,
                  name: "static",
                  args: [[[{ type: "string", content: "2" }]]],
                },
              },
              { type: "string", content: "4" },
            ],
            [{ type: "string", content: "5" }],
          ],
        ],
      },
    },
  ]);
});

void test("parse: mixed strings and multiple counters", () => {
  const input =
    "Hello {http:someurl:cachelifetime} World! {http:someurl:cachelifetime}!!!";
  const result = parse(input);

  assert.deepEqual(result, [
    { type: "string", content: "Hello " },
    {
      type: "old_counter",
      defintion: {
        format: null,
        name: "http",
        args: [
          [[{ type: "string", content: "someurl" }]],
          [[{ type: "string", content: "cachelifetime" }]],
        ],
      },
    },
    { type: "string", content: " World! " },
    {
      type: "old_counter",
      defintion: {
        format: null,
        name: "http",
        args: [
          [[{ type: "string", content: "someurl" }]],
          [[{ type: "string", content: "cachelifetime" }]],
        ],
      },
    },
    { type: "string", content: "!!!" },
  ]);
});

void test("parse: empty input", () => {
  const input = "";
  const result = parse(input);

  assert.deepEqual(result, []);
});

void test("convert #1", () => {
  const input = "{members} Members";
  const expectedOutput = '\u001f{"id":0}\u001f Members';
  const result = convert(input);

  assert.equal(result, expectedOutput);
});

void test("convert #2", () => {
  const input =
    "{membersWithRole:1249753045126877215} Admins, {onlineMembersWithRole:1249753045126877215} Online, ({multiply:{divide:{onlineMembersWithRole:1249753045126877215},{membersWithRole:1249753045126877215}},100}%)";
  const expectedOutput =
    '\x1F{"id":0,"options":{"roles":["1249753045126877215"],"statusFilter":0}}\x1F Admins, \x1F{"id":0,"options":{"roles":["1249753045126877215"],"statusFilter":1}}\x1F Online, (\x1F{"id":1,"options":{"numbers":[{"id":16,"options":{"number":{"id":1,"options":{"numbers":[{"id":16,"options":{"number":{"id":0,"options":{"roles":["1249753045126877215"],"statusFilter":1}}}},{"id":16,"options":{"number":{"id":0,"options":{"roles":["1249753045126877215"],"statusFilter":0}}}}],"operation":3}}}},100],"operation":2}}\x1F%)';
  const result = convert(input);

  assert.equal(result, expectedOutput);
});
