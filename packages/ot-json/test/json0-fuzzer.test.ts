/* eslint-disable @typescript-eslint/no-var-requires */
import type { O, P } from "@block-kit/utils/dist/es/types";

import type { Op } from "../src";
import { json as json0, text } from "../src";
import { clone } from "../src/utils";

json0.registerSubtype(text);

const randomKey = (obj: P.Any) => {
  const { randomInt, randomReal } = require("ot-fuzzer");
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return undefined;
    }
    return randomInt(obj.length);
  }

  let result;
  let count = 0;

  for (const key in obj) {
    if (randomReal() < 1 / ++count) {
      result = key;
    }
  }
  return result;
};

// Generate a random new key for a value in obj.
// obj must be an Object.
const randomNewKey = (obj: P.Any) => {
  const { randomWord } = require("ot-fuzzer");
  let key = randomWord();
  while (obj[key] !== undefined) {
    key = randomWord();
  }
  return key;
};

// Generate a random object
const randomThing = (): P.Any => {
  const { randomInt, randomWord } = require("ot-fuzzer");
  switch (randomInt(6)) {
    case 0:
      return null;
    case 1:
      return "";
    case 2:
      return randomWord();
    case 3: {
      const obj = {};
      const count = randomInt(5);
      for (let i = 0; i < count; i++) {
        (obj as O.Any)[randomNewKey(obj)] = randomThing();
      }
      return obj;
    }
    case 4: {
      const arr = [];
      const count = randomInt(5);
      for (let i = 0; i < count; i++) {
        arr.push(randomThing());
      }
      return arr;
    }
    case 5:
      return randomInt(50);
  }
};

// Pick a random path to something in the object.
const randomPath = (data: P.Any) => {
  const { randomReal } = require("ot-fuzzer");
  const path = [];
  let currentData = data;

  while (randomReal() > 0.85 && typeof currentData === "object") {
    const key = randomKey(currentData);
    if (key === undefined) break;

    path.push(key);
    currentData = currentData[key];
  }

  return path;
};

const genRandomOp = (data: P.Any) => {
  const { randomReal, randomInt, randomWord } = require("ot-fuzzer");
  let pct = 0.95;
  const container = { data: clone(data) };
  const op: Op[] = [];

  while (randomReal() < pct) {
    pct *= 0.6;

    // Pick a random object in the document operate on.
    const path = randomPath(container.data);

    // parent = the container for the operand. parent[key] contains the operand.
    let parent: O.Any = container;
    let key: string | number = "data";
    for (const p of path) {
      parent = parent[key];
      key = p;
    }
    const operand = parent[key];

    if (randomReal() < 0.4 && parent !== container && Array.isArray(parent)) {
      // List move
      const newIndex = randomInt(parent.length);

      // Remove the element from its current position in the list
      const [movedItem] = parent.splice(<number>key, 1);
      // Insert it in the new position.
      parent.splice(newIndex, 0, movedItem);

      op.push({ p: path, lm: newIndex });
    } else if (randomReal() < 0.3 || operand == null) {
      // Replace
      const newValue = randomThing();
      parent[key] = newValue;

      if (Array.isArray(parent)) {
        op.push({ p: path, ld: operand, li: clone(newValue) });
      } else {
        op.push({ p: path, od: operand, oi: clone(newValue) });
      }
    } else if (typeof operand === "string") {
      // String. This code is adapted from the text op generator.
      let c;
      if (randomReal() > 0.5 || operand.length === 0) {
        // Insert
        const pos = randomInt(operand.length + 1);
        const str = randomWord() + " ";

        path.push(pos);
        parent[key] = operand.slice(0, pos) + str + operand.slice(pos);
        c = { p: path, si: str };
      } else {
        // Delete
        const pos = randomInt(operand.length);
        const length = Math.min(randomInt(4), operand.length - pos);
        const str = operand.slice(pos, pos + length);

        path.push(pos);
        parent[key] = operand.slice(0, pos) + operand.slice(pos + length);
        c = { p: path, sd: str };
      }

      if ((json0 as O.Any)._testStringSubtype) {
        // Subtype
        const subOp = { p: path.pop() };
        if (c.si) {
          (subOp as O.Any).i = c.si;
        } else {
          (subOp as O.Any).d = c.sd;
        }

        c = { p: path, t: "text0", o: [subOp] };
      }

      op.push(c);
    } else if (typeof operand === "number") {
      // Number
      const inc = randomInt(10) - 3;
      parent[key] += inc;
      op.push({ p: path, na: inc });
    } else if (Array.isArray(operand)) {
      // Array. Replace is covered above, so we'll just randomly insert or delete.
      if (randomReal() > 0.5 || operand.length === 0) {
        // Insert
        const pos = randomInt(operand.length + 1);
        const obj = randomThing();

        const newPath = [...path, pos];
        operand.splice(pos, 0, obj);
        op.push({ p: newPath, li: clone(obj) });
      } else {
        // Delete
        const pos = randomInt(operand.length);
        const obj = operand[pos];

        const newPath = [...path, pos];
        operand.splice(pos, 1);
        op.push({ p: newPath, ld: clone(obj) });
      }
    } else {
      // Object
      let k = randomKey(operand);

      if (randomReal() > 0.5 || !k) {
        // Insert
        k = randomNewKey(operand);
        const obj = randomThing();

        const newPath = [...path, k];
        operand[k] = obj;
        op.push({ p: newPath, oi: clone(obj) });
      } else {
        const obj = operand[k];

        const newPath = [...path, k];
        delete operand[k];
        op.push({ p: newPath, od: clone(obj) });
      }
    }
  }

  return [op, container.data];
};

describe("randomizer", () => {
  const consoleError = console.error;
  const consoleLog = console.log;
  const consoleTime = console.time;
  const consoleTimeEnd = console.timeEnd;

  beforeAll(() => {
    console.time = jest.fn();
    console.timeEnd = jest.fn();
    console.error = jest.fn();
    console.log = jest.fn();
  });

  afterAll(() => {
    console.error = consoleError;
    console.log = consoleLog;
    console.time = consoleTime;
    console.timeEnd = consoleTimeEnd;
  });

  it("passes", () => {
    const fuzzer = require("ot-fuzzer");
    try {
      fuzzer(json0, genRandomOp, 10);
    } catch (error) {
      if (String(error).includes("fuzzercrash.data")) {
        consoleLog("Fuzzer test link:", error);
      } else {
        throw error;
      }
    }
  });

  it("passes with string subtype", () => {
    const fuzzer = require("ot-fuzzer");
    (json0 as P.Any)._testStringSubtype = true; // hack
    try {
      fuzzer(json0, genRandomOp, 10);
    } catch (error) {
      if (String(error).includes("fuzzercrash.data")) {
        consoleLog("Fuzzer test link:", error);
      } else {
        throw error;
      }
    }
    delete (json0 as P.Any)._testStringSubtype;
  });
});
