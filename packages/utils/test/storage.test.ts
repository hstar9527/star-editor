import { Storage } from "../src/storage";

describe("date-time", () => {
  beforeAll(() => {
    const data: Record<string, string> = {};
    const mock = {
      getItem: (key: string) => data[key],
      setItem: (key: string, value: string) => (data[key] = value),
      removeItem: (key: string) => delete data[key],
    };
    Object.assign(global, { localStorage: mock, sessionStorage: mock });
  });

  it("save value", () => {
    const key = "save-value";
    const value = { data: 1 };
    Storage.local.set(key, value);
    expect(Storage.local.get(key)).toEqual(value);
    expect(Storage.local.getOrigin(key)).toBe('{"origin":{"data":1},"expire":null}');
  });

  it("save value with ttl", async () => {
    const key = "save-value-ttl";
    const value = { data: 1 };
    Storage.local.set(key, value, 10);
    expect(Storage.local.get(key)).toEqual(value);
    await new Promise<void>(r => setTimeout(r, 20));
    expect(Storage.local.get(key)).toBeNull();
  });
});
