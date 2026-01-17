import { IS_TEST } from "../src/env";

describe("env", () => {
  it("IS_TEST", () => {
    expect(IS_TEST).toBeTruthy();
  });
});
