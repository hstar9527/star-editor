import { Format } from "../src/format";

describe("format", () => {
  it("string", () => {
    expect(Format.string("{{0}}", ["data"])).toBe("data");
    expect(Format.string("{{id}}", { id: "data" })).toBe("data");
  });

  it("number", () => {
    expect(Format.number(1123)).toBe("1,123");
  });

  it("bytes", () => {
    expect(Format.bytes(0)).toBe("0 B");
    expect(Format.bytes(1024)).toBe("1.00 KB");
    expect(Format.bytes(1025, 3)).toBe("1.001 KB");
    expect(Format.bytes(1024 ** 2)).toBe("1.00 MB");
    expect(Format.bytes(1024 ** 3)).toBe("1.00 GB");
    expect(Format.bytes(1024 ** 4)).toBe("1.00 TB");
  });

  it("time", () => {
    expect(Format.time(2000, 3000)).toBe("1 second ago");
    expect(Format.time(3000, 1000 * 60)).toBe("57 seconds ago");
    expect(Format.time(3000, 1000 * 60 * 60)).toBe("59 minutes ago");
    expect(Format.time(3000, 1000 * 60 * 60 * 24)).toBe("23 hours ago");
    expect(Format.time(3000, 1000 * 60 * 60 * 24 * 30)).toBe("29 days ago");
    expect(Format.time(3000, 1000 * 60 * 60 * 24 * 365)).toBe("12 months ago");
  });
});
