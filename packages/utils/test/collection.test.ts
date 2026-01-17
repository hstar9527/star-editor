import { Collection } from "../src/collection";

describe("collection", () => {
  it("pick", () => {
    const target = { a: 1, b: 2, c: 3 };
    const result = Collection.pick(target, ["a", "b"]);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("omit", () => {
    const target = { a: 1, b: 2, c: 3 };
    const result = Collection.omit(target, ["a", "b"]);
    expect(result).toEqual({ c: 3 });
  });

  it("patch", () => {
    const a = new Set([1, 2, 3]);
    const b = new Set([2, 3, 4]);
    const result = Collection.patch(a, b);
    expect(result).toEqual({
      effects: new Set([4, 1]),
      added: new Set([4]),
      removed: new Set([1]),
    });
  });

  it("union", () => {
    const a = new Set([1, 2, 3]);
    const b = new Set([2, 3, 4]);
    const result = Collection.union(a, b);
    expect(result).toEqual(new Set([1, 2, 3, 4]));
  });

  it("intersect", () => {
    const a = new Set([1, 2, 3]);
    const b = new Set([2, 3, 4]);
    const result = Collection.intersect(a, b);
    expect(result).toEqual(new Set([2, 3]));
  });

  it("subset", () => {
    const a = new Set([2, 3]);
    const b = new Set([1, 2, 3]);
    const result = Collection.subset(a, b);
    expect(result).toBeTruthy();
  });

  it("superset", () => {
    const a = new Set([1, 2, 3]);
    const b = new Set([2, 3]);
    const result = Collection.superset(a, b);
    expect(result).toBeTruthy();
  });

  it("symmetric", () => {
    const a = new Set([1, 2, 3]);
    const b = new Set([2, 3, 4]);
    const result = Collection.symmetric(a, b);
    expect(result).toEqual(new Set([4]));
  });

  it("at", () => {
    const target = [0, 1, 2, 3];
    expect(Collection.at(target, 0)).toBe(0);
    expect(Collection.at(target, -1)).toBe(3);
  });
});
