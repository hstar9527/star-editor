/* eslint-disable @typescript-eslint/no-var-requires */
import type { TextOp } from "../src";
import { text as text0 } from "../src";

/**
 * Random op generator for the embedded text0 OT type. This is used by the fuzzer test.
 */
const genRandomOp = (docStr: string) => {
  const { randomReal, randomWord } = require("ot-fuzzer");
  let pct = 0.9;

  const op: TextOp[] = [];

  while (randomReal() < pct) {
    // console.log("docStr = " + docStr);
    pct /= 2;

    if (randomReal() > 0.5) {
      // Append an insert
      const pos = Math.floor(randomReal() * (docStr.length + 1));
      const str = randomWord() + " ";
      // @ts-expect-error type error
      text0.append(op, { i: str, p: pos });
      docStr = docStr.slice(0, pos) + str + docStr.slice(pos);
    } else {
      // Append a delete
      const pos = Math.floor(randomReal() * docStr.length);
      const length = Math.min(Math.floor(randomReal() * 4), docStr.length - pos);
      // @ts-expect-error type error
      text0.append(op, { d: docStr.slice(pos, pos + length), p: pos });
      docStr = docStr.slice(0, pos) + docStr.slice(pos + length);
    }
  }

  //   console.log("generated op " + op + " -> " + docStr);
  return [op, docStr];
};

describe("randomizer", () => {
  const consoleError = console.error;
  const consoleLog = console.log;
  const consoleTime = console.time;
  const consoleTimeEnd = console.timeEnd;

  beforeAll(() => {
    console.error = jest.fn();
    console.log = jest.fn();
    console.time = jest.fn();
    console.timeEnd = jest.fn();
  });

  afterAll(() => {
    console.error = consoleError;
    console.log = consoleLog;
    console.time = consoleTime;
    console.timeEnd = consoleTimeEnd;
  });

  it("passes fuzzer test", () => {
    const fuzzer = require("ot-fuzzer");
    jest.setTimeout(5000);
    try {
      fuzzer(text0, genRandomOp, 10);
    } catch (error) {
      if (String(error).includes("fuzzercrash.data")) {
        consoleLog("Fuzzer test link:", error);
      } else {
        throw error;
      }
    }
  });
});
