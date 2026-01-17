import type { Op } from "../src";
import { json } from "../src";

describe("number", () => {
  it("Adds a number", () => {
    expect(json.apply(1, [{ p: [], na: 2 }])).toEqual(3);
    expect(json.apply([1], [{ p: [0], na: 2 }])).toEqual([3]);
  });

  it("compresses two adds together in compose", () => {
    expect(json.compose([{ p: ["a", "b"], na: 1 }], [{ p: ["a", "b"], na: 2 }])).toEqual([
      { p: ["a", "b"], na: 3 },
    ]);

    expect(json.compose([{ p: ["a"], na: 1 }], [{ p: ["b"], na: 2 }])).toEqual([
      { p: ["a"], na: 1 },
      { p: ["b"], na: 2 },
    ]);
  });

  it("doesn't overwrite values when it merges na in append", () => {
    const rightHas = 21;
    const leftHas = 3;

    const rightOps: Op[] = [
      { p: [], od: 0, oi: 15 },
      { p: [], na: 4 },
      { p: [], na: 1 },
      { p: [], na: 1 },
    ];
    const leftOp = [
      { p: [], na: 4 },
      { p: [], na: -1 },
    ];
    // @ts-expect-error private error
    const [right_, left_] = json.transformX(rightOps, leftOp);

    const s_c = json.apply(rightHas, left_);
    const c_s = json.apply(leftHas, right_);
    expect(s_c).toEqual(c_s);
  });

  it("throws when adding a string to a number", () => {
    // @ts-expect-error type error
    expect(() => json.apply(1, [{ p: [], na: "a" }])).toThrow();
  });

  it("throws when adding a number to a string", () => {
    expect(() => json.apply("a", [{ p: [], na: 1 }])).toThrow();
  });
});
