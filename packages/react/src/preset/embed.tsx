import { VOID_KEY } from "@block-kit/core";
import { Range } from "@block-kit/core";
import { Point } from "@block-kit/core";
import type { FC, PropsWithChildren } from "react";
import React from "react";

import { useEditorStatic } from "../hooks/use-editor";
import type { ReactLeafContext } from "../plugin/types";
import { LEAF_TO_ZERO_TEXT } from "../utils/weak-map";
import { ZeroSpace } from "./zero";

export type EmbedProps = PropsWithChildren<{
  context: ReactLeafContext;
  className?: string;
  style?: React.CSSProperties;
  onMousedown?: (event: React.MouseEvent<HTMLSpanElement>) => void;
}>;

/**
 * Embed 嵌入节点 HOC
 * - Inline Block HOC
 * @param props
 */
export const Embed: FC<EmbedProps> = props => {
  const { context } = props;
  const { editor } = useEditorStatic();
  const leaf = context.leafState;

  const onMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    const point = new Point(leaf.parent.index, leaf.offset + 1);
    const range = new Range(point, point.clone());
    editor.selection.set(range, true);
    props.onMousedown && props.onMousedown(event);
  };

  return (
    <React.Fragment>
      <ZeroSpace
        embed={true}
        len={leaf.length > 1 ? leaf.length : void 0}
        onRef={el => el && LEAF_TO_ZERO_TEXT.set(leaf, el)}
      />
      <span
        className={props.className}
        style={{ margin: "0 0.1px", ...props.style }}
        contentEditable={false}
        {...{ [VOID_KEY]: true }}
        onMouseDown={onMouseDown}
      >
        {props.children}
      </span>
    </React.Fragment>
  );
};
