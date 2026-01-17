import { IconCode } from "@arco-design/web-react/icon";
import { cs, NIL, TRULY } from "@block-kit/utils";
import type { FC } from "react";

import { INLINE_CODE_KEY } from "../../inline-code/types";
import { useToolbarContext } from "../context/provider";

export const InlineCode: FC = () => {
  const { keys, refreshMarks, editor } = useToolbarContext();

  return (
    <div
      className={cs("menu-toolbar-item", keys[INLINE_CODE_KEY] && "active")}
      onClick={() => {
        editor.command.exec(INLINE_CODE_KEY, { value: keys[INLINE_CODE_KEY] ? NIL : TRULY });
        refreshMarks();
      }}
    >
      <IconCode />
    </div>
  );
};
