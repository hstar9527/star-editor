import { getUniqueId } from "../src/uuid";

describe("id", () => {
  it("unique id length", () => {
    expect(getUniqueId()).toHaveLength(10);
    expect(getUniqueId(5)).toHaveLength(5);
    expect(getUniqueId(15)).toHaveLength(15);
  });
});
