import { sleep, to } from "../src/native";

describe("native", () => {
  it("sleep", async () => {
    const ms = 100;
    const start = Date.now();
    await sleep(ms);
    expect(Date.now() - start).toBeGreaterThanOrEqual(ms);
  });

  it("to", async () => {
    const [err, res] = await to(Promise.resolve(1));
    expect(err).toBeNull();
    expect(res).toBe(1);
  });

  it("to error", async () => {
    const [err, res] = await to(Promise.reject("error"));
    expect(err).toEqual(new Error("error"));
    expect(res).toBeUndefined();
  });

  it("to undefined", async () => {
    const [err, res] = await to(Promise.reject());
    expect(err).toBeInstanceOf(Error);
    expect(res).toBeUndefined();
  });
});
