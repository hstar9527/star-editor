import { Delta } from "@block-kit/delta";
import { MutateDelta } from "@block-kit/delta";

import { Editor } from "../../src/editor";

describe("state content", () => {
  it("set content", () => {
    const editor = new Editor({ delta: new Delta().insert("123").insert("\n") });
    editor.state.setContent(new Delta().insert("456").insert("\n"));
    expect(editor.state.toBlock()).toEqual(new MutateDelta().insert("456").insert("\n"));
  });

  it("set content multi EOL", () => {
    const editor = new Editor({ delta: new Delta().insert("123").insert("\n") });
    editor.state.setContent(new Delta().insert("456").insert("\n\n"));
    expect(editor.state.toBlock()).toEqual(new MutateDelta().insert("456").insertEOL().insertEOL());
  });
});
