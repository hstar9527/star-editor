import "../styles/float.scss";

import type { SelectionChangeEvent } from "@block-kit/core";
import { EDITOR_EVENT } from "@block-kit/core";
import { useEditorStatic, useReadonly } from "@block-kit/react";
import { MountNode } from "@block-kit/react";
import { cs } from "@block-kit/utils";
import { useForceUpdate, useMemoFn } from "@block-kit/utils/dist/es/hooks";
import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";

import { Toolbar } from "./basic";

export const FloatToolbar: FC<{
  /**
   * 样式类名
   */
  className?: string;
  /**
   * Top 偏移
   */
  offsetTop?: number;
  /**
   * Left 偏移
   */
  offsetLeft?: number;
  /**
   * 挂载的 DOM
   */
  mountDOM?: HTMLElement;
  /**
   * 重载工具栏位置
   */
  overridePosition?: () => { left: number; top: number };
}> = props => {
  const { editor } = useEditorStatic();
  const { readonly } = useReadonly();
  const ref = useRef<HTMLDivElement>(null);
  const { index, forceUpdate } = useForceUpdate();
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);

  const onCaretWeakUp = useMemoFn((wakeUp: boolean) => {
    if (!readonly && editor.state.isFocused() && wakeUp) {
      setVisible(true);
      !isMouseDown && forceUpdate();
    } else {
      setVisible(false);
    }
  });

  useEffect(() => {
    if (readonly) return void 0;
    const onMouseUp = () => {
      setIsMouseDown(false);
    };
    const onMouseDown = (event: MouseEvent) => {
      // 避免浮动工具栏的快速重置
      if (event.detail === 3) return void 0;
      setIsMouseDown(true);
    };
    const onSelectionChange = (e: SelectionChangeEvent) => {
      const { current } = e;
      const isWakeUp = current ? !current.isCollapsed : false;
      onCaretWeakUp(isWakeUp);
    };
    document.addEventListener(EDITOR_EVENT.MOUSE_UP, onMouseUp);
    document.addEventListener(EDITOR_EVENT.MOUSE_DOWN, onMouseDown);
    editor.event.on(EDITOR_EVENT.SELECTION_CHANGE, onSelectionChange);
    return () => {
      document.removeEventListener(EDITOR_EVENT.MOUSE_UP, onMouseUp);
      document.removeEventListener(EDITOR_EVENT.MOUSE_DOWN, onMouseDown);
      editor.event.off(EDITOR_EVENT.SELECTION_CHANGE, onSelectionChange);
    };
  }, [editor, onCaretWeakUp, readonly]);

  const { left, top } = useMemo(() => {
    if (!readonly && visible && !isMouseDown) {
      if (props.overridePosition) {
        return props.overridePosition(); // overlay
      }
      const rect = editor.rect.getCaretRect();
      if (rect) {
        const topOffset = props.offsetTop || 0;
        const leftOffset = props.offsetLeft || 0;
        const t = rect.top + topOffset;
        const l = rect.left + rect.width / 2 + leftOffset;
        return { top: t, left: l };
      }
    }
    return { top: -999999, left: -999999 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, readonly, visible, isMouseDown]);

  // 只读状态 / 不可见 / 鼠标按下 时隐藏
  return readonly || !visible || isMouseDown
    ? null
    : ReactDOM.createPortal(
        <Toolbar
          onRef={ref}
          className={cs("block-kit-float-toolbar", props.className)}
          styles={{ top: top, left: left }}
        >
          {props.children}
        </Toolbar>,
        props.mountDOM || MountNode.get(editor)
      );
};
