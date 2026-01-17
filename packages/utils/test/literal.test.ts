import { Literal } from "../src/literal";

describe("literal", () => {
  it("escapeHtml", () => {
    const result = Literal.escapeHtml("<script>alert('xss')</script>");
    expect(result).toEqual("&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;");
  });

  it("compare", () => {
    expect(Literal.compare("a", "b")).toEqual(-1);
    expect(Literal.compare("a", "a")).toEqual(0);
    expect(Literal.compare("b", "a")).toEqual(1);
    expect(Literal.compare("a", "ab")).toBeLessThan(0);
    expect(Literal.compare("ab", "a")).toBeGreaterThan(0);
  });

  it("numberify", () => {
    const result = Literal.numberify("abc");
    expect(result).toEqual(294);
  });
});
