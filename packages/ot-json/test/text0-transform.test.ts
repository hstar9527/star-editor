import { text } from "../src";

describe("transform", () => {
  it("is sane", () => {
    expect(text.transform([], [], "left")).toEqual([]);
    expect(text.transform([], [], "right")).toEqual([]);

    expect(
      text.transform(
        [
          { i: "y", p: 100 },
          { i: "x", p: 0 },
        ],
        [],
        "left"
      )
    ).toEqual([
      { i: "y", p: 100 },
      { i: "x", p: 0 },
    ]);
    expect(
      text.transform(
        [],
        [
          { i: "y", p: 100 },
          { i: "x", p: 0 },
        ],
        "right"
      )
    ).toEqual([]);
  });

  it("inserts", () => {
    // @ts-expect-error private
    expect(text.transformX([{ i: "x", p: 9 }], [{ i: "a", p: 1 }])).toEqual([
      [{ i: "x", p: 10 }],
      [{ i: "a", p: 1 }],
    ]);
    // @ts-expect-error private
    expect(text.transformX([{ i: "x", p: 10 }], [{ i: "a", p: 10 }])).toEqual([
      [{ i: "x", p: 10 }],
      [{ i: "a", p: 11 }],
    ]);

    // @ts-expect-error private
    expect(text.transformX([{ i: "x", p: 11 }], [{ d: "a", p: 9 }])).toEqual([
      [{ i: "x", p: 10 }],
      [{ d: "a", p: 9 }],
    ]);
    // @ts-expect-error private
    expect(text.transformX([{ i: "x", p: 11 }], [{ d: "a", p: 10 }])).toEqual([
      [{ i: "x", p: 10 }],
      [{ d: "a", p: 10 }],
    ]);
    // @ts-expect-error private
    expect(text.transformX([{ i: "x", p: 11 }], [{ d: "a", p: 11 }])).toEqual([
      [{ i: "x", p: 11 }],
      [{ d: "a", p: 12 }],
    ]);

    expect(text.transform([{ i: "x", p: 10 }], [{ d: "a", p: 11 }], "left")).toEqual([
      { i: "x", p: 10 },
    ]);
    expect(text.transform([{ i: "x", p: 10 }], [{ d: "a", p: 10 }], "left")).toEqual([
      { i: "x", p: 10 },
    ]);
    expect(text.transform([{ i: "x", p: 10 }], [{ d: "a", p: 10 }], "right")).toEqual([
      { i: "x", p: 10 },
    ]);
  });

  it("deletes", () => {
    // @ts-expect-error private
    expect(text.transformX([{ d: "abc", p: 10 }], [{ d: "xy", p: 4 }])).toEqual([
      [{ d: "abc", p: 8 }],
      [{ d: "xy", p: 4 }],
    ]);
    // @ts-expect-error private
    expect(text.transformX([{ d: "abc", p: 10 }], [{ d: "b", p: 11 }])).toEqual([
      [{ d: "ac", p: 10 }],
      [],
    ]);
    // @ts-expect-error private
    expect(text.transformX([{ d: "b", p: 11 }], [{ d: "abc", p: 10 }])).toEqual([
      [],
      [{ d: "ac", p: 10 }],
    ]);
    // @ts-expect-error private
    expect(text.transformX([{ d: "abc", p: 10 }], [{ d: "bc", p: 11 }])).toEqual([
      [{ d: "a", p: 10 }],
      [],
    ]);
    // @ts-expect-error private
    expect(text.transformX([{ d: "abc", p: 10 }], [{ d: "ab", p: 10 }])).toEqual([
      [{ d: "c", p: 10 }],
      [],
    ]);
    // @ts-expect-error private
    expect(text.transformX([{ d: "abc", p: 10 }], [{ d: "bcd", p: 11 }])).toEqual([
      [{ d: "a", p: 10 }],
      [{ d: "d", p: 10 }],
    ]);
    // @ts-expect-error private
    expect(text.transformX([{ d: "bcd", p: 11 }], [{ d: "abc", p: 10 }])).toEqual([
      [{ d: "d", p: 10 }],
      [{ d: "a", p: 10 }],
    ]);
    // @ts-expect-error private
    expect(text.transformX([{ d: "abc", p: 10 }], [{ d: "xy", p: 13 }])).toEqual([
      [{ d: "abc", p: 10 }],
      [{ d: "xy", p: 10 }],
    ]);
  });
});
