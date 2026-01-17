import { Bind } from "../src/decorator";

describe("decorator", () => {
  it("Bind", () => {
    class Test {
      @Bind
      method() {
        return this;
      }
    }
    const test = new Test();
    const method = test.method;
    expect(method()).toBe(test);
  });
});
