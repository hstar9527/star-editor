import { TSON } from "../src/json";

describe("JSON", () => {
  it("parse", () => {
    const str = '{"a":1,"b":"2","c":[3,"4"]}';
    const data = TSON.decode(str);
    expect(data).toEqual({ a: 1, b: "2", c: [3, "4"] });
  });

  it("stringify", () => {
    const data = { a: 1, b: "2", c: [3, "4"] };
    const str = TSON.encode(data);
    expect(str).toBe('{"a":1,"b":"2","c":[3,"4"]}');
  });
});
