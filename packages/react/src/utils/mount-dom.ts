import type { Editor } from "@block-kit/core";
import type { O } from "@block-kit/utils/dist/es/types";
import type { ReactPortal } from "react";
import { createPortal } from "react-dom";

export const EDITOR_TO_DOM = new WeakMap<Editor, HTMLElement | null>();
export const EDITOR_TO_PORTAL = new WeakMap<
  Editor,
  React.Dispatch<React.SetStateAction<O.Map<ReactPortal>>> | null
>();

/**
 * 共享的挂载节点
 */
export const MountNode = {
  /**
   * 设置挂载 DOM
   * @param editor
   * @param dom
   */
  set: (editor: Editor, dom: HTMLElement | null) => {
    EDITOR_TO_DOM.set(editor, dom);
  },
  /**
   * 获取挂载 DOM
   * @param editor
   * @param dom
   */
  get: (editor: Editor) => {
    return EDITOR_TO_DOM.get(editor) || document.body;
  },
  /**
   * 渲染节点
   * @param editor
   * @param key
   * @param node
   * @param dom [?=undef]
   */
  mount: (editor: Editor, key: string, node: JSX.Element, dom?: HTMLElement) => {
    const setPortals = EDITOR_TO_PORTAL.get(editor);
    if (!setPortals) return void 0;
    const portal = createPortal(node, dom || MountNode.get(editor));
    setPortals(prev => {
      const newNodes = { ...prev };
      newNodes[key] = portal;
      return newNodes;
    });
  },
  /**
   * 卸载节点
   * @param editor
   * @param key
   */
  unmount: (editor: Editor, key: string) => {
    const setPortals = EDITOR_TO_PORTAL.get(editor);
    if (!setPortals) return void 0;
    setPortals(prev => {
      const newNodes = { ...prev };
      delete newNodes[key];
      return newNodes;
    });
  },
};
