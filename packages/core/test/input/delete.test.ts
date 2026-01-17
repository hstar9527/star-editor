import { Delta } from "@block-kit/delta";

import { Editor } from "../../src/editor";
import { LOG_LEVEL } from "../../src/log";
import { Range } from "../../src/selection/modules/range";
import { mountEditorViewModel } from "../config/view";

describe("input delete", () => {
  const delta = new Delta({
    ops: [{ insert: "text1 text2 text3" }, { insert: "\n" }],
  });
  const editor = new Editor({ delta, logLevel: LOG_LEVEL.INFO });
  const { container } = mountEditorViewModel(editor);

  it("delete word", () => {
    const range = Range.fromTuple([0, 11], [0, 11]);
    editor.selection.set(range, true);
    const event = new InputEvent("beforeinput", {
      inputType: "deleteWordBackward",
    });
    container.dispatchEvent(event);
    const newDelta = new Delta({
      ops: [{ insert: "text1  text3" }, { insert: "\n" }],
    });
    expect(editor.state.toBlock()).toEqual(newDelta);
  });
});
