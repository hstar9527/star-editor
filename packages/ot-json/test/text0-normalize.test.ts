import type { TextOp } from "../src";
import { text } from "../src";

describe("normalize", () => {
  it("is sane", () => {
    const testUnchanged = (op: TextOp[]) => expect(text.normalize(op)).toEqual(op);
    testUnchanged([]);
    testUnchanged([{ i: "asdf", p: 100 }]);
    testUnchanged([
      { i: "asdf", p: 100 },
      { d: "fdsa", p: 123 },
    ]);
  });

  it("adds missing p:0", () => {
    // @ts-expect-error non-p
    expect(text.normalize([{ i: "abc" }])).toEqual([{ i: "abc", p: 0 }]);
    // @ts-expect-error non-p
    expect(text.normalize([{ d: "abc" }])).toEqual([{ d: "abc", p: 0 }]);
    // @ts-expect-error non-p
    expect(text.normalize([{ i: "abc" }, { d: "abc" }])).toEqual([
      { i: "abc", p: 0 },
      { d: "abc", p: 0 },
    ]);
  });

  it("converts op to an array", () => {
    expect(text.normalize({ i: "abc", p: 0 })).toEqual([{ i: "abc", p: 0 }]);
    expect(text.normalize({ d: "abc", p: 0 })).toEqual([{ d: "abc", p: 0 }]);
  });

  it("works with a really simple op", () => {
    // @ts-expect-error non-p
    expect(text.normalize({ i: "abc" })).toEqual([{ i: "abc", p: 0 }]);
  });

  it("compress inserts", () => {
    expect(
      text.normalize([
        { i: "abc", p: 10 },
        { i: "xyz", p: 10 },
      ])
    ).toEqual([{ i: "xyzabc", p: 10 }]);
    expect(
      text.normalize([
        { i: "abc", p: 10 },
        { i: "xyz", p: 11 },
      ])
    ).toEqual([{ i: "axyzbc", p: 10 }]);
    expect(
      text.normalize([
        { i: "abc", p: 10 },
        { i: "xyz", p: 13 },
      ])
    ).toEqual([{ i: "abcxyz", p: 10 }]);
  });

  it("doesnt compress separate inserts", () => {
    const t = (op: TextOp[]) => expect(text.normalize(op)).toEqual(op);
    t([
      { i: "abc", p: 10 },
      { i: "xyz", p: 9 },
    ]);
    t([
      { i: "abc", p: 10 },
      { i: "xyz", p: 14 },
    ]);
  });

  it("compress deletes", () => {
    expect(
      text.normalize([
        { d: "abc", p: 10 },
        { d: "xy", p: 8 },
      ])
    ).toEqual([{ d: "xyabc", p: 8 }]);
    expect(
      text.normalize([
        { d: "abc", p: 10 },
        { d: "xy", p: 9 },
      ])
    ).toEqual([{ d: "xabcy", p: 9 }]);
    expect(
      text.normalize([
        { d: "abc", p: 10 },
        { d: "xy", p: 10 },
      ])
    ).toEqual([{ d: "abcxy", p: 10 }]);
  });

  it("doesnt compress separate deletes", () => {
    const t = (op: TextOp[]) => expect(text.normalize(op)).toEqual(op);
    t([
      { d: "abc", p: 10 },
      { d: "xyz", p: 6 },
    ]);
    t([
      { d: "abc", p: 10 },
      { d: "xyz", p: 11 },
    ]);
  });
});
