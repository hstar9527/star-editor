import { cs, cx, Facade } from "../src/styles";

describe("styles", () => {
  it("cs", () => {
    expect(cs("a", "b", "c")).toBe("a b c");
    expect(cs("a", undefined, "c")).toBe("a c");
    expect(cs("a", { b: true }, "c")).toBe("a c");
  });

  it("cx", () => {
    expect(cx("a", "b", "c")).toBe("a b c");
    expect(cx("a", null, "c")).toBe("a c");
    expect(cx("a", undefined, "c")).toBe("a c");
    expect(cx("a", { b: true, c: false })).toBe("a b");
    expect(cx("a", { b: true, c: true })).toBe("a b c");
    expect(cx("a", { b: false, c: false })).toBe("a");
  });

  it("pixelate", () => {
    expect(Facade.pixelate("0px")).toBe("0px");
    expect(Facade.pixelate("1px")).toBe("1px");
    expect(Facade.pixelate("1%")).toBe(null);
    expect(Facade.pixelate("1")).toBe("1px");
    expect(Facade.pixelate("a")).toBe(null);
    expect(Facade.pixelate("")).toBe(null);
    expect(Facade.pixelate(0)).toBe("0px");
    expect(Facade.pixelate(null)).toBe(null);
  });

  it("digitize", () => {
    expect(Facade.digitize("0px")).toBe(0);
    expect(Facade.digitize("1px")).toBe(1);
    expect(Facade.digitize("1%")).toBe(0.01);
    expect(Facade.digitize("1")).toBe(1);
    expect(Facade.digitize("a")).toBe(null);
    expect(Facade.digitize("")).toBe(null);
    expect(Facade.digitize(null)).toBe(null);
  });
});
