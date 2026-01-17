import type { Op } from "@block-kit/delta";
import { Delta, EOL_OP } from "@block-kit/delta";
import { Bind, TEXT_HTML, TEXT_PLAIN, TSON } from "@block-kit/utils";

import type { Editor } from "../editor";
import { EDITOR_EVENT } from "../event/bus/";
import { Copy } from "./modules/copy";
import { Paste } from "./modules/paste";
import { TEXT_DOC } from "./types";

export class Clipboard {
  /** Copy Module */
  public copyModule: Copy;
  /** Paste Module */
  public pasteModule: Paste;

  /**
   * 构造函数
   * @param editor
   */
  constructor(protected editor: Editor) {
    this.copyModule = new Copy(editor);
    this.pasteModule = new Paste(editor);
    this.editor.event.on(EDITOR_EVENT.CUT, this.onCut);
    this.editor.event.on(EDITOR_EVENT.COPY, this.onCopy);
    this.editor.event.on(EDITOR_EVENT.PASTE, this.onPaste);
  }

  /**
   * 销毁模块
   */
  public destroy() {
    this.editor.event.off(EDITOR_EVENT.CUT, this.onCut);
    this.editor.event.off(EDITOR_EVENT.COPY, this.onCopy);
    this.editor.event.off(EDITOR_EVENT.PASTE, this.onPaste);
  }

  /**
   * OnCopy 事件
   * @param event
   */
  @Bind
  protected onCopy(event: ClipboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    const sel = this.editor.selection.get();
    if (!sel) return void 0;
    const delta = new Delta();
    if (sel.isCollapsed) {
      // 在选区折叠的情况下需要特判 Void 节点类型
      const op = this.editor.lookup.getOpAtPoint(sel.start);
      if (op && this.editor.schema.isVoid(op)) {
        delta.push(op);
      }
    } else {
      const fragment = this.editor.lookup.getFragment();
      fragment && delta.ops.push(...fragment);
      // 如果选区跨行, 则需要将结束行的行格式也添加到复制内容中
      if (sel.start.line !== sel.end.line) {
        const endLine = this.editor.state.block.getLine(sel.end.line);
        endLine && delta.push({ ...EOL_OP, attributes: endLine.attributes });
      }
    }
    if (!delta.ops.length) return void 0;
    this.copyModule.copy(delta, event);
  }

  /**
   * OnCut 事件
   * @param event
   */
  @Bind
  protected onCut(event: ClipboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    const sel = this.editor.selection.get();
    if (!sel) return void 0;
    this.onCopy(event);
    if (sel.isCollapsed) {
      const leaf = this.editor.lookup.getLeafAtPoint(sel.start);
      if (leaf && this.editor.schema.isVoid(leaf.op)) {
        this.editor.perform.deleteFragment(leaf.toRange());
      }
    } else {
      this.editor.perform.deleteFragment(sel);
    }
  }

  /**
   * OnPaste 事件
   * @param event
   */
  @Bind
  protected onPaste(event: ClipboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    const transfer = event.clipboardData;
    if (!transfer || this.editor.state.isReadonly()) {
      return void 0;
    }
    const files = Array.from(transfer.files);
    const transferDocText = transfer.getData(TEXT_DOC);
    const transferHTMLText = transfer.getData(TEXT_HTML);
    const transferPlainText = transfer.getData(TEXT_PLAIN);
    this.editor.logger.info("Paste Clipboard Data:", {
      files: files,
      [TEXT_DOC]: transferDocText,
      [TEXT_HTML]: transferHTMLText,
      [TEXT_PLAIN]: transferPlainText,
    });
    if (transferDocText) {
      const ops = TSON.parse<Op[]>(transferDocText);
      const delta = ops && new Delta(ops);
      return delta && this.pasteModule.applyDelta(delta, event);
    }
    if (files.length) {
      return this.pasteModule.applyFiles(files, event);
    }
    if (transferHTMLText) {
      return this.pasteModule.applyHTMLText(transferHTMLText, event);
    }
    if (transferPlainText) {
      return this.pasteModule.applyPlainText(transfer, event);
    }
  }
}
