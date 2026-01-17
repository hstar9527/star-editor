import { Point, Range, RawPoint } from "@block-kit/core";
import { Delta } from "@block-kit/delta";
import { CTRL_KEY, KEY_CODE, NIL, TRULY } from "@block-kit/utils";
import type { O } from "@block-kit/utils/dist/es/types";

import { BOLD_KEY } from "../../bold/types";
import { BULLET_LIST_KEY, LIST_TYPE_KEY } from "../../bullet-list/types";
import { DIVIDER_KEY } from "../../divider/types";
import { HEADING_KEY } from "../../heading/types";
import { ITALIC_KEY } from "../../italic/types";
import { ORDER_LIST_KEY } from "../../order-list/types";
import { QUOTE_KEY } from "../../quote/types";
import { isKeyCode } from "../../shared/utils/is";
import type { ShortcutFuncMap } from "../types";

export const PRESET_SHORTCUT: ShortcutFuncMap = {
  [BOLD_KEY]: (event, payload) => {
    if (event[CTRL_KEY] && isKeyCode(event, KEY_CODE.B) && payload.sel) {
      const { editor, keys, sel } = payload;
      editor.perform.applyMarks(sel, { [BOLD_KEY]: keys[BOLD_KEY] ? NIL : TRULY });
      return true;
    }
  },
  [ITALIC_KEY]: (event, payload) => {
    if (event[CTRL_KEY] && isKeyCode(event, KEY_CODE.I) && payload.sel) {
      const { editor, keys, sel } = payload;
      editor.perform.applyMarks(sel, { [ITALIC_KEY]: keys[ITALIC_KEY] ? NIL : TRULY });
      return true;
    }
  },
  [LIST_TYPE_KEY]: (event, payload) => {
    if (isKeyCode(event, KEY_CODE.SPACE) && payload.sel && payload.sel.isCollapsed) {
      const { editor, sel } = payload;
      const line = editor.state.block.getLine(sel.start.line);
      const firstLeaf = line && line.getFirstLeaf();
      const text = firstLeaf && firstLeaf.getText();
      if (text === "1.") {
        editor.perform.deleteForward(
          Range.fromTuple([sel.start.line, 0], [sel.start.line, text.length])
        );
        editor.command.exec(ORDER_LIST_KEY, { value: TRULY });
        event.preventDefault();
        return true;
      }
      if (text === "-" || text === "*") {
        editor.perform.deleteForward(
          Range.fromTuple([sel.start.line, 0], [sel.start.line, text.length])
        );
        editor.command.exec(BULLET_LIST_KEY, { value: TRULY });
        event.preventDefault();
        return true;
      }
    }
  },
  [DIVIDER_KEY]: (event, payload) => {
    if (isKeyCode(event, KEY_CODE.SPACE) && payload.sel && payload.sel.isCollapsed) {
      const { editor, sel } = payload;
      const line = editor.state.block.getLine(sel.start.line);
      const firstLeaf = line && line.getFirstLeaf();
      const text = firstLeaf && firstLeaf.getText();
      if (text === "---") {
        editor.perform.deleteForward(
          Range.fromTuple([sel.start.line, 0], [sel.start.line, text.length])
        );
        const start = RawPoint.fromPoint(editor, new Point(sel.start.line, 0));
        if (!start) return void 0;
        const delta = new Delta().retain(start.offset).insert(" ", { [DIVIDER_KEY]: TRULY });
        editor.state.apply(delta, { preventNormalize: true });
        event.preventDefault();
        return true;
      }
    }
  },
  [QUOTE_KEY]: (event, payload) => {
    if (isKeyCode(event, KEY_CODE.SPACE) && payload.sel && payload.sel.isCollapsed) {
      const { editor, sel } = payload;
      const line = editor.state.block.getLine(sel.start.line);
      const firstLeaf = line && line.getFirstLeaf();
      const text = firstLeaf && firstLeaf.getText();
      if (text === ">") {
        editor.perform.deleteForward(
          Range.fromTuple([sel.start.line, 0], [sel.start.line, text.length])
        );
        editor.command.exec(QUOTE_KEY, { value: TRULY });
        event.preventDefault();
        return true;
      }
    }
  },
  [HEADING_KEY]: (event, payload) => {
    if (isKeyCode(event, KEY_CODE.SPACE) && payload.sel && payload.sel.isCollapsed) {
      const { editor, sel } = payload;
      const line = editor.state.block.getLine(sel.start.line);
      const firstLeaf = line && line.getFirstLeaf();
      const text = firstLeaf && firstLeaf.getText();
      const HEADING_MAP: O.Map<string> = {
        "#": "1",
        "##": "2",
        "###": "3",
      };
      if (text && HEADING_MAP[text]) {
        editor.perform.deleteForward(
          Range.fromTuple([sel.start.line, 0], [sel.start.line, text.length])
        );
        editor.command.exec(HEADING_KEY, { value: "h" + HEADING_MAP[text] });
        event.preventDefault();
        return true;
      }
    }
  },
};
