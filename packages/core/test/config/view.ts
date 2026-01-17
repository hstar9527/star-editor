import { ROOT_BLOCK } from "@block-kit/utils";

import type { Editor } from "../../src/index";
import {
  createBlockDOM,
  createContainerDOM,
  createEmbedDOM,
  createEnterDOM,
  createLeafDOM,
  createLineDOM,
  createTextDOM,
} from "./dom";

export const mountEditorViewModel = (editor: Editor) => {
  const lines = editor.state.block.getLines();

  const leafDOMs = lines.map(lineState => {
    const leaves = lineState.getLeaves();
    const textLeaves = leaves.slice(0, -1);
    const nodes = textLeaves.map(n => {
      let dom: HTMLElement | DocumentFragment;
      if (n.embed) {
        const extraDOM = document.createElement("div");
        extraDOM.setAttribute("data-embed-text", "true");
        extraDOM.appendChild(document.createTextNode(n.op.attributes?.text || " "));
        dom = createEmbedDOM(extraDOM);
      } else {
        dom = createTextDOM(n.getText());
      }
      const leafDOM = createLeafDOM(dom);
      editor.model.setLeafModel(leafDOM, n);
      return leafDOM;
    });
    // 空行则仅存在一个 Leaf, 此时需要渲染空的占位节点
    if (!nodes.length && leaves[0]) {
      const leaf = leaves[0];
      const dom = createEnterDOM();
      const leafDOM = createLeafDOM(dom);
      editor.model.setLeafModel(leafDOM, leaf);
      nodes.push(leafDOM);
      return nodes;
    }
    // Embed 在行未时需要预设零宽字符来放置光标
    const eolLeaf = leaves[leaves.length - 1];
    const lastLeaf = textLeaves[textLeaves.length - 1];
    if (lastLeaf && eolLeaf && lastLeaf.embed) {
      const dom = createEnterDOM();
      const leafDOM = createLeafDOM(dom);
      editor.model.setLeafModel(leafDOM, eolLeaf);
      nodes.push(leafDOM);
    }
    return nodes;
  });

  const lineDOMs = leafDOMs.map((dom, index) => {
    const lineDOM = createLineDOM(dom);
    editor.model.setLineModel(lineDOM, lines[index]);
    return lineDOM;
  });

  const block = createBlockDOM(ROOT_BLOCK, lineDOMs);
  const container = createContainerDOM([block]);
  editor.mount(container as HTMLDivElement);
  document.body.appendChild(container);

  return { block, container, lineDOMs, leafDOMs };
};

// Polyfill JSDOM 的 Selection 相关方法
const selection = document.getSelection();
if (selection && selection.setBaseAndExtent.name !== "setBaseAndExtentMock") {
  const native = selection.setBaseAndExtent;
  selection.setBaseAndExtent = function setBaseAndExtentMock(
    anchorNode: Node,
    anchorOffset: number,
    focusNode: Node,
    focusOffset: number
  ) {
    native.call(selection, anchorNode, anchorOffset, focusNode, focusOffset);
    document.dispatchEvent(new Event("selectionchange"));
  };
}

if (selection && !selection.modify) {
  // 仅处理 move backward word
  selection.modify = function modifyMock() {
    const textNode = selection.focusNode as Text;
    const text = textNode.textContent || "";
    const lastWordIndex = text.lastIndexOf(" ", selection.focusOffset - 1);
    if (lastWordIndex !== -1) {
      const newOffset = lastWordIndex + 1;
      selection.setBaseAndExtent(textNode, newOffset, textNode, newOffset);
    } else {
      selection.setBaseAndExtent(textNode, 0, textNode, 0);
    }
    document.dispatchEvent(new Event("selectionchange"));
  };
}
