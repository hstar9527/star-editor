import { RegExec } from "../src/regexp";

describe("regexp", () => {
  it("exec", () => {
    const result = RegExec.exec(/>(.+)?</, "<div>123</div>");
    expect(result).toEqual("123");
  });

  it("match", () => {
    const result = RegExec.match(/<div>(.+?)<\/div>/g, "<div>123</div><div>456</div>");
    expect(result).toEqual(["123", "456"]);
  });

  it("get", () => {
    const result1 = RegExec.get(["a", "b"], 0);
    const result2 = RegExec.get(["a", "b"], 2);
    expect(result1).toEqual("a");
    expect(result2).toEqual("");
  });
});
