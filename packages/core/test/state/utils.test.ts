import { Delta } from "@block-kit/delta";
import { MutateDelta } from "@block-kit/delta";

import { Editor } from "../../src/editor";
import { normalizeDelta, removeLastEOL } from "../../src/state/utils/normalize";

describe("state utils", () => {
  it("normalize compose ops", () => {
    const editor = new Editor({
      schema: {
        block: { void: true, block: true },
      },
    });
    const delta = new Delta()
      .insert("123\n456\n")
      .insert(" ", { block: "true" })
      .insert("789")
      .insert(" ", { block: "true" });
    const nextOps = normalizeDelta(editor, delta).ops;
    expect(nextOps).toEqual([
      { insert: "123" },
      { insert: "\n" },
      { insert: "456" },
      { insert: "\n" },
      { insert: " ", attributes: { block: "true" } },
      { insert: "\n" },
      { insert: "789" },
      { insert: " ", attributes: { block: "true" } },
      { insert: "\n" },
    ]);
  });

  it("normalize remove last EOL", () => {
    const delta = new Delta().insert("123\n456\n");
    expect(removeLastEOL(delta)).toEqual(new Delta().insert("123\n456"));
    const delta2 = new Delta().insert("123\n456");
    expect(removeLastEOL(delta2)).toEqual(new Delta().insert("123\n456"));
    const delta3 = new MutateDelta().insert("123\n456").insert("\n");
    expect(removeLastEOL(delta3)).toEqual(new Delta().insert("123\n456"));
    const delta4 = new Delta().insert("123\n456\n\n");
    expect(removeLastEOL(delta4)).toEqual(new Delta().insert("123\n456\n"));
  });
});
