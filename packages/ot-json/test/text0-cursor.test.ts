import { text } from "../src";

describe("transform-cursor", () => {
  it("is sane", () => {
    expect(text.transformCursor(0, [], "right")).toEqual(0);
    expect(text.transformCursor(0, [], "left")).toEqual(0);
    expect(text.transformCursor(100, [])).toEqual(100);
  });

  it("works vs insert", () => {
    expect(text.transformCursor(0, [{ i: "asdf", p: 100 }], "right")).toEqual(0);
    expect(text.transformCursor(0, [{ i: "asdf", p: 100 }], "left")).toEqual(0);

    expect(text.transformCursor(200, [{ i: "asdf", p: 100 }], "right")).toEqual(204);
    expect(text.transformCursor(200, [{ i: "asdf", p: 100 }], "left")).toEqual(204);

    expect(text.transformCursor(100, [{ i: "asdf", p: 100 }], "right")).toEqual(104);
    expect(text.transformCursor(100, [{ i: "asdf", p: 100 }], "left")).toEqual(100);
  });

  it("works vs delete", () => {
    expect(text.transformCursor(0, [{ d: "asdf", p: 100 }], "right")).toEqual(0);
    expect(text.transformCursor(0, [{ d: "asdf", p: 100 }], "left")).toEqual(0);
    expect(text.transformCursor(0, [{ d: "asdf", p: 100 }])).toEqual(0);

    expect(text.transformCursor(200, [{ d: "asdf", p: 100 }])).toEqual(196);

    expect(text.transformCursor(100, [{ d: "asdf", p: 100 }])).toEqual(100);
    expect(text.transformCursor(102, [{ d: "asdf", p: 100 }])).toEqual(100);
    expect(text.transformCursor(104, [{ d: "asdf", p: 100 }])).toEqual(100);
    expect(text.transformCursor(105, [{ d: "asdf", p: 100 }])).toEqual(101);
  });
});
