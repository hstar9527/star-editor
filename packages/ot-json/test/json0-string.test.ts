import { json, text } from "../src";

describe("string", () => {
  // Strings should be handled internally by the text json. We'll just do some basic sanity checks here.
  json.registerSubtype(text);

  describe("#apply()", () => {
    it("works", () => {
      expect(json.apply("a", [{ p: [1], si: "bc" }])).toEqual("abc");
      expect(json.apply("abc", [{ p: [0], sd: "a" }])).toEqual("bc");
      expect(json.apply({ x: "a" }, [{ p: ["x", 1], si: "bc" }])).toEqual({ x: "abc" });
    });

    it("throws when the target is not a string", () => {
      expect(() => json.apply([1], [{ p: [0], si: "a" }])).toThrow();
    });

    it("throws when the inserted content is not a string", () => {
      // @ts-expect-error type error
      expect(() => json.apply("a", [{ p: [0], si: 1 }])).toThrow();
    });
  });

  describe("#transform()", () => {
    it("splits deletes", () => {
      expect(json.transform([{ p: [0], sd: "ab" }], [{ p: [1], si: "x" }], "left")).toEqual([
        { p: [0], sd: "a" },
        { p: [1], sd: "b" },
      ]);
    });

    it("cancels out other deletes", () => {
      expect(
        json.transform([{ p: ["k", 5], sd: "a" }], [{ p: ["k", 5], sd: "a" }], "left")
      ).toEqual([]);
    });

    it("does not throw errors with blank inserts", () => {
      expect(json.transform([{ p: ["k", 5], si: "" }], [{ p: ["k", 3], si: "a" }], "left")).toEqual(
        []
      );
    });
  });
});
