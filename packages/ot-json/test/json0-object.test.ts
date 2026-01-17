import type { Op } from "../src";
import { json, text } from "../src";

describe("object", () => {
  json.registerSubtype(text);

  it("passes sanity checks", () => {
    expect(json.apply({ x: "a" }, [{ p: ["y"], oi: "b" }])).toEqual({ x: "a", y: "b" });
    expect(json.apply({ x: "a" }, [{ p: ["x"], od: "a" }])).toEqual({});
    expect(json.apply({ x: "a" }, [{ p: ["x"], od: "a", oi: "b" }])).toEqual({ x: "b" });
  });

  it("Ops on deleted elements become noops", () => {
    expect(json.transform([{ p: [1, 0], si: "hi" }], [{ p: [1], od: "x" }], "left")).toEqual([]);
    expect(
      json.transform(
        [{ p: [1], t: "text0", o: [{ p: 0, i: "hi" }] }],
        [{ p: [1], od: "x" }],
        "left"
      )
    ).toEqual([]);
    expect(
      json.transform([{ p: [9], si: "bite " }], [{ p: [], od: "agimble s", oi: null }], "right")
    ).toEqual([]);
    expect(
      json.transform(
        [{ p: [], t: "text0", o: [{ p: 9, i: "bite " }] }],
        [{ p: [], od: "agimble s", oi: null }],
        "right"
      )
    ).toEqual([]);
  });

  it("Ops on replaced elements become noops", () => {
    expect(
      json.transform([{ p: [1, 0], si: "hi" }], [{ p: [1], od: "x", oi: "y" }], "left")
    ).toEqual([]);
    expect(
      json.transform(
        [{ p: [1], t: "text0", o: [{ p: 0, i: "hi" }] }],
        [{ p: [1], od: "x", oi: "y" }],
        "left"
      )
    ).toEqual([]);
  });

  it("Deleted data is changed to reflect edits", () => {
    expect(json.transform([{ p: [1], od: "a" }], [{ p: [1, 1], si: "bc" }], "left")).toEqual([
      { p: [1], od: "abc" },
    ]);
    expect(
      json.transform(
        [{ p: [1], od: "a" }],
        [{ p: [1], t: "text0", o: [{ p: 1, i: "bc" }] }],
        "left"
      )
    ).toEqual([{ p: [1], od: "abc" }]);
    expect(json.transform([{ p: [], od: 22, oi: [] }], [{ p: [], na: 3 }], "left")).toEqual([
      { p: [], od: 25, oi: [] },
    ]);
    expect(
      json.transform(
        [{ p: [], od: { toves: 0 }, oi: 4 }],
        [{ p: ["toves"], od: 0, oi: "" }],
        "left"
      )
    ).toEqual([{ p: [], od: { toves: "" }, oi: 4 }]);
    expect(
      json.transform([{ p: [], od: "thou and ", oi: [] }], [{ p: [7], sd: "d " }], "left")
    ).toEqual([{ p: [], od: "thou an", oi: [] }]);
    expect(
      json.transform(
        [{ p: [], od: "thou and ", oi: [] }],
        [{ p: [], t: "text0", o: [{ p: 7, d: "d " }] }],
        "left"
      )
    ).toEqual([{ p: [], od: "thou an", oi: [] }]);
    expect(
      json.transform([{ p: ["bird"], na: 2 }], [{ p: [], od: { bird: 38 }, oi: 20 }], "right")
    ).toEqual([]);
    expect(
      json.transform([{ p: [], od: { bird: 38 }, oi: 20 }], [{ p: ["bird"], na: 2 }], "left")
    ).toEqual([{ p: [], od: { bird: 40 }, oi: 20 }]);
    expect(json.transform([{ p: ["He"], od: [] }], [{ p: ["The"], na: -3 }], "right")).toEqual([
      { p: ["He"], od: [] },
    ]);
    expect(json.transform([{ p: ["He"], oi: {} }], [{ p: [], od: {}, oi: "the" }], "left")).toEqual(
      []
    );
  });

  it("If two inserts are simultaneous, the lefts insert will win", () => {
    expect(json.transform([{ p: [1], oi: "a" }], [{ p: [1], oi: "b" }], "left")).toEqual([
      { p: [1], oi: "a", od: "b" },
    ]);
    expect(json.transform([{ p: [1], oi: "b" }], [{ p: [1], oi: "a" }], "right")).toEqual([]);
  });

  it("parallel ops on different keys miss each other", () => {
    expect(json.transform([{ p: ["a"], oi: "x" }], [{ p: ["b"], oi: "z" }], "left")).toEqual([
      { p: ["a"], oi: "x" },
    ]);
    expect(json.transform([{ p: ["a"], oi: "x" }], [{ p: ["b"], od: "z" }], "left")).toEqual([
      { p: ["a"], oi: "x" },
    ]);
    expect(
      json.transform([{ p: ["in", "he"], oi: {} }], [{ p: ["and"], od: {} }], "right")
    ).toEqual([{ p: ["in", "he"], oi: {} }]);
    expect(
      json.transform([{ p: ["x", 0], si: "his " }], [{ p: ["y"], od: 0, oi: 1 }], "right")
    ).toEqual([{ p: ["x", 0], si: "his " }]);
    expect(
      json.transform(
        [{ p: ["x"], t: "text0", o: [{ p: 0, i: "his " }] }],
        [{ p: ["y"], od: 0, oi: 1 }],
        "right"
      )
    ).toEqual([{ p: ["x"], t: "text0", o: [{ p: 0, i: "his " }] }]);
  });

  it("replacement vs. deletion", () => {
    expect(json.transform([{ p: [], od: [""], oi: {} }], [{ p: [], od: [""] }], "right")).toEqual([
      { p: [], oi: {} },
    ]);
  });

  it("replacement vs. replacement", () => {
    expect(
      json.transform([{ p: [], od: [""], oi: {} }], [{ p: [], od: [""], oi: null }], "right")
    ).toEqual([]);

    expect(
      json.transform([{ p: [], od: [""], oi: {} }], [{ p: [], od: [""], oi: null }], "left")
    ).toEqual([{ p: [], od: null, oi: {} }]);

    expect(
      json.transform(
        [
          { p: [], od: [""] },
          { p: [], oi: {} },
        ],
        [
          { p: [], od: [""] },
          { p: [], oi: null },
        ],
        "right"
      )
    ).toEqual([]);

    expect(
      json.transform(
        [
          { p: [], od: [""] },
          { p: [], oi: {} },
        ],
        [
          { p: [], od: [""] },
          { p: [], oi: null },
        ],
        "left"
      )
    ).toEqual([{ p: [], od: null, oi: {} }]);

    // test diamond property
    const rightOps = [{ p: [], od: null, oi: {} }];
    const leftOps = [{ p: [], od: null, oi: "" }];
    // eslint-disable-next-line prefer-spread
    const rightHas = json.apply(null, rightOps);
    // eslint-disable-next-line prefer-spread
    const leftHas = json.apply(null, leftOps);
    // Cross-transform helper function. Transform server by client and client by
    // server. Returns [server, client].
    const transformX = (left: Op[], right: Op[]) => [
      json.transform(left, right, "left"),
      json.transform(right, left, "right"),
    ];
    const [left_, right_] = transformX(leftOps, rightOps);
    expect(json.apply(rightHas, left_!)).toEqual(leftHas);
    expect(json.apply(leftHas, right_!)).toEqual(leftHas);
  });

  it("An attempt to re-delete a key becomes a no-op", () => {
    expect(json.transform([{ p: ["k"], od: "x" }], [{ p: ["k"], od: "x" }], "left")).toEqual([]);

    expect(json.transform([{ p: ["k"], od: "x" }], [{ p: ["k"], od: "x" }], "right")).toEqual([]);
  });

  it("throws when the insertion key is a number", () => {
    expect(() => json.apply({ 1: "a" }, [{ p: [2], oi: "a" }])).toThrow();
  });

  it("throws when the deletion key is a number", () => {
    expect(() => json.apply({ 1: "a" }, [{ p: [1], od: "a" }])).toThrow();
  });

  it("throws when an object key part-way through the path is a number", () => {
    expect(() => json.apply({ 1: { x: "a" } }, [{ p: [1, "x"], od: "a" }])).toThrow();
  });
});
