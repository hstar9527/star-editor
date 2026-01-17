import { Delta } from "@block-kit/delta";
import { isDOMText, TEXT_HTML, TEXT_PLAIN } from "@block-kit/utils";

import type { Editor } from "../../editor";
import { CALLER_TYPE } from "../../plugin/types";
import { normalizeDelta } from "../../state/utils/normalize";
import type { DeserializeContext, PasteContext } from "../types";

export class Paste {
  /**
   * 构造函数
   * @param editor
   */
  public constructor(protected editor: Editor) {}

  /**
   * 应用剪贴板 Delta
   * @param delta
   */
  public applyDelta(delta: Delta, event: ClipboardEvent) {
    const context: PasteContext = { delta, event };
    this.editor.plugin.call(CALLER_TYPE.WILL_PASTE_DELTAS, context);
    this.editor.logger.info("Editor Will Apply:", context.delta);
    try {
      const sel = this.editor.selection.get();
      sel && this.editor.perform.insertFragment(sel, context.delta);
    } catch (error) {
      this.editor.logger.error("InsertFragment Error:", error, context.delta);
    }
  }

  /**
   * 处理剪贴板纯文本
   * @param transfer
   */
  public applyPlainText(transfer: DataTransfer, event: ClipboardEvent) {
    const text = transfer.getData(TEXT_PLAIN) || "";
    const delta = normalizeDelta(this.editor, new Delta().insert(text));
    this.applyDelta(delta, event);
  }

  /**
   * 处理文件数据
   * @param files
   */
  public applyFiles(files: File[], event: ClipboardEvent) {
    const root = document.createDocumentFragment();
    const context: DeserializeContext = { html: root, delta: new Delta(), files };
    this.editor.plugin.call(CALLER_TYPE.DESERIALIZE, context);
    this.applyDelta(context.delta, event);
  }

  /**
   * 处理 HTML 数据
   * @param htmlText
   */
  public applyHTMLText(transferHTMLText: string, event: ClipboardEvent) {
    const parser = new DOMParser();
    const html = parser.parseFromString(transferHTMLText, TEXT_HTML);
    if (!html.body || !html.body.hasChildNodes()) return void 0;
    const delta = this.deserialize(html.body);
    return this.applyDelta(delta, event);
  }

  /**
   * 反序列化 HTML 为 Delta
   * @param current
   */
  public deserialize(current: Node): Delta {
    const delta = new Delta();
    // 结束条件 Text Image 等节点都会在此时处理
    if (!current.childNodes.length) {
      if (isDOMText(current)) {
        const text = current.textContent || "";
        delta.insert(text);
      } else {
        const context: DeserializeContext = { delta, html: current };
        this.editor.plugin.call(CALLER_TYPE.DESERIALIZE, context);
        return context.delta;
      }
      return delta;
    }
    const children = Array.from(current.childNodes);
    for (const child of children) {
      const newDelta = this.deserialize(child);
      delta.ops.push(...newDelta.ops);
    }
    const context: DeserializeContext = { delta, html: current };
    this.editor.plugin.call(CALLER_TYPE.DESERIALIZE, context);
    return context.delta;
  }
}
