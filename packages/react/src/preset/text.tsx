import { LEAF_STRING } from "@block-kit/core";
import { useMemoFn } from "@block-kit/utils/dist/es/hooks";
import { useState, useRef,type FC } from "react";
import type { F, Func, P } from "@block-kit/utils/dist/es/types";

export type TextProps = {
  children: string;
  onRef?: (ref: HTMLSpanElement | null) => void;
};

/**
 * 文本节点
 * @param props
 */
export const Text: FC<TextProps> = props => {
  if(props.children==='Block Kit') {
    const fnRef = useRef<Func.Any>();
    const fnRef2 = useRef<Func.Any>();
    console.log('fn==fn2', fnRef === fnRef2)
  }

  /**
   * 处理 ref 回调
   * - 需要保证引用不变, 否则会导致回调在 rerender 时被多次调用 null/span 状态
   * - https://18.react.dev/reference/react-dom/components/common#ref-callback
   */
  const onRef = useMemoFn((dom: HTMLSpanElement | null) => {
    props.onRef && props.onRef(dom);
  });

  return (
    <span ref={onRef} {...{ [LEAF_STRING]: true }}>
      {props.children}
    </span>
  );
};
