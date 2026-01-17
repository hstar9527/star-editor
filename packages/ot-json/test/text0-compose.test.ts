import { text } from "../src";

describe("compose", () => {
  it("is sane", () => {
    expect(text.compose([], [])).toEqual([]);
    expect(text.compose([{ i: "x", p: 0 }], [])).toEqual([{ i: "x", p: 0 }]);
    expect(text.compose([], [{ i: "x", p: 0 }])).toEqual([{ i: "x", p: 0 }]);
    expect(text.compose([{ i: "y", p: 100 }], [{ i: "x", p: 0 }])).toEqual([
      { i: "y", p: 100 },
      { i: "x", p: 0 },
    ]);
  });
});
