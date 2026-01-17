import type { Op } from "../src";
import { json, text } from "../src";

describe("string subtype", () => {
  json.registerSubtype(text);

  // @ts-expect-error ts error
  json.registerSubtype({
    name: "mock",
    transform: () => {
      return { mock: true };
    },
  });

  describe("#apply()", () => {
    it("works", () => {
      expect(json.apply("a", [{ p: [], t: "text0", o: [{ p: 1, i: "bc" }] }])).toEqual("abc");
      expect(json.apply("abc", [{ p: [], t: "text0", o: [{ p: 0, d: "a" }] }])).toEqual("bc");
      expect(json.apply({ x: "a" }, [{ p: ["x"], t: "text0", o: [{ p: 1, i: "bc" }] }])).toEqual({
        x: "abc",
      });
    });
  });

  describe("#transform()", () => {
    it("splits deletes", () => {
      const a = [{ p: [], t: "text0", o: [{ p: 0, d: "ab" }] }];
      const b = [{ p: [], t: "text0", o: [{ p: 1, i: "x" }] }];
      expect(json.transform(a, b, "left")).toEqual([
        {
          p: [],
          t: "text0",
          o: [
            { p: 0, d: "a" },
            { p: 1, d: "b" },
          ],
        },
      ]);
    });

    it("cancels out other deletes", () => {
      expect(
        json.transform(
          [{ p: ["k"], t: "text0", o: [{ p: 5, d: "a" }] }],
          [{ p: ["k"], t: "text0", o: [{ p: 5, d: "a" }] }],
          "left"
        )
      ).toEqual([]);
    });

    it("does not throw errors with blank inserts", () => {
      expect(
        json.transform(
          [{ p: ["k"], t: "text0", o: [{ p: 5, i: "" }] }],
          [{ p: ["k"], t: "text0", o: [{ p: 3, i: "a" }] }],
          "left"
        )
      ).toEqual([]);
    });
  });
});

describe("subtype with non-array operation", () => {
  describe("#transform()", () => {
    it("works", () => {
      const a: Op[] = [{ p: [], t: "mock", o: "foo" }];
      const b: Op[] = [{ p: [], t: "mock", o: "bar" }];
      expect(json.transform(a, b, "left")).toEqual([{ p: [], t: "mock", o: { mock: true } }]);
    });
  });
});
