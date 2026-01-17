import { Delta } from "@block-kit/delta";

import { Editor, LEAF_STRING, LOG_LEVEL, ZERO_SPACE_KEY } from "../../src";
import { createTextNodeWalker } from "../../src/selection/utils/native";
import { mountEditorViewModel } from "../config/view";

describe("walker", () => {
  it("text leaves", () => {
    const delta = new Delta({
      ops: [
        { insert: "text" },
        { insert: " ", attributes: { mention: " ", text: "123456" } },
        { insert: " ", attributes: { mention: " ", text: "789" } },
        { insert: "\n" },
      ],
    });
    const editor = new Editor({
      delta,
      logLevel: LOG_LEVEL.INFO,
      schema: {
        mention: { inline: true, void: true },
      },
    });
    const { lineDOMs } = mountEditorViewModel(editor);
    const container = lineDOMs[0];
    const walker = createTextNodeWalker(container);
    const selector = `span[${LEAF_STRING}], span[${ZERO_SPACE_KEY}]`;
    const leaves = container.querySelectorAll(selector);
    let i = 0;
    for (const [node, nextNode] of walker) {
      expect(node === leaves[i]).toBe(true);
      expect(nextNode === (leaves[i + 1] || null)).toBe(true);
      i++;
    }
  });
});
