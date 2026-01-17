import type { Editor } from "@block-kit/core";
import type { Range } from "@block-kit/core";
import type { O, P } from "@block-kit/utils/dist/es/types";

export const SHORTCUT_KEY = "SHORTCUT_KEY";

export type ShortcutFunc = (
  event: KeyboardEvent,
  payload: {
    editor: Editor;
    keys: O.Map<string>;
    sel: Range | null;
  }
) => true | P.Nil;

export type ShortcutFuncMap = O.Map<ShortcutFunc>;
