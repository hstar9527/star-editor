import type { CorePlugin, Editor, LeafState, LineState } from "@block-kit/core";
import type { O, P } from "@block-kit/utils/dist/es/types";
import React from "react";

import { JSX_TO_STATE } from "../../utils/weak-map";
import type { EditorPlugin } from "../index";
import type { ReactWrapLeafContext, ReactWrapLineContext } from "../types";
import { WRAP_TYPE } from "../types";
import { getPluginPriority } from "./priority";

/** 插件的 WrapKey 后缀 */
const SUFFIX_KEY = "Keys";
/** Editor 行 Keys 存储 */
export const EDITOR_TO_WRAP_LINE_KEYS = new WeakMap<Editor, string[]>();
/** Editor 节点 Keys 存储 */
export const EDITOR_TO_WRAP_LEAF_KEYS = new WeakMap<Editor, string[]>();
/** Editor 行 Wrap 插件 */
export const EDITOR_TO_WRAP_LINE_PLUGINS = new WeakMap<Editor, EditorPlugin[]>();
/** Editor 节点 Wrap 插件 */
export const EDITOR_TO_WRAP_LEAF_PLUGINS = new WeakMap<Editor, EditorPlugin[]>();
/**
 * State 与 Wrapper Symbol 的映射
 * - 主要是取得已经处理过的节点, 避免重复处理
 */
export const STATE_TO_SYMBOL = new WeakMap<LeafState | LineState, string>();

/**
 * 装饰器, 为 WrapNode 定义 Key
 * @param ...keys
 */
export function InjectWrapKeys<T>(...keys: string[]) {
  return function (
    target: T,
    key: O.Values<typeof WRAP_TYPE>,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const wrapPluginKey = `${key}${SUFFIX_KEY}`;
    const plugin = target as O.Mixed;
    plugin[wrapPluginKey] = keys;
    return descriptor;
  };
}

/**
 * 获取插件的 WrapKeys
 * @param key
 * @param plugin
 */
export const getWrapKeys = (key: string, plugin: CorePlugin): string[] | P.Undef => {
  const wrapPluginKey = `${key}${SUFFIX_KEY}`;
  const wrapPlugin = plugin as O.Any;
  const keys = wrapPlugin[wrapPluginKey];
  return keys;
};

/**
 * 根据 Wrap Keys 以及元素获取唯一标识值
 * @param keys
 * @param element
 */
export const getWrapSymbol = (keys: string[], el: JSX.Element | undefined): string | null => {
  if (!el) return null;
  const state = JSX_TO_STATE.get(el);
  const cache = state && STATE_TO_SYMBOL.get(state);
  if (cache || !state) return cache || null;
  const attrs = state.op.attributes;
  if (!attrs || !Object.keys(attrs).length || !keys.length) {
    return null;
  }
  const suite: string[] = [];
  for (const key of keys) {
    attrs[key] && suite.push(`${key}${attrs[key]}`);
  }
  const symbol = suite.join("");
  STATE_TO_SYMBOL.set(state, symbol);
  return symbol;
};

/**
 * 初始化 Wrap 模式的插件
 * - Wrap 模式的插件化在 React 层面渲染时实现
 * - 其是渲染时调度且不存在 WrapState 的概念
 * @param editor
 */
export const initWrapPlugins = (editor: Editor) => {
  const plugins = editor.plugin.current as EditorPlugin[];
  const wrapLineKeys: string[] = [];
  const wrapLeafKeys: string[] = [];
  const wrapLinePlugins: EditorPlugin[] = [];
  const wrapLeafPlugins: EditorPlugin[] = [];
  for (const plugin of plugins) {
    const lineKeys = getWrapKeys(WRAP_TYPE.LINE, plugin);
    lineKeys && wrapLineKeys.push(...lineKeys);
    const leafKeys = getWrapKeys(WRAP_TYPE.LEAF, plugin);
    leafKeys && wrapLeafKeys.push(...leafKeys);
    plugin.wrapLine && wrapLinePlugins.push(plugin);
    plugin.wrapLeaf && wrapLeafPlugins.push(plugin);
  }
  wrapLinePlugins.sort((a, b) => {
    const priorityA = getPluginPriority(WRAP_TYPE.LINE, a);
    const priorityB = getPluginPriority(WRAP_TYPE.LINE, b);
    return priorityA - priorityB;
  });
  wrapLeafPlugins.sort((a, b) => {
    const priorityA = getPluginPriority(WRAP_TYPE.LEAF, a);
    const priorityB = getPluginPriority(WRAP_TYPE.LEAF, b);
    return priorityA - priorityB;
  });
  wrapLineKeys.length && EDITOR_TO_WRAP_LINE_KEYS.set(editor, wrapLineKeys);
  wrapLeafKeys.length && EDITOR_TO_WRAP_LEAF_KEYS.set(editor, wrapLeafKeys);
  wrapLinePlugins.length && EDITOR_TO_WRAP_LINE_PLUGINS.set(editor, wrapLinePlugins);
  wrapLeafPlugins.length && EDITOR_TO_WRAP_LEAF_PLUGINS.set(editor, wrapLeafPlugins);
};

/**
 * 将行节点包装组合 O(N)
 * @param editor
 * @param elements
 */
export const withWrapLineNodes = (editor: Editor, elements: JSX.Element[]): JSX.Element[] => {
  const wrapped: JSX.Element[] = [];
  const keys = EDITOR_TO_WRAP_LINE_KEYS.get(editor);
  const plugins = EDITOR_TO_WRAP_LINE_PLUGINS.get(editor);
  if (!keys || !plugins) return elements;
  const len = elements.length;
  for (let i = 0; i < len; ++i) {
    const element = elements[i];
    const symbol = getWrapSymbol(keys, element);
    const line = JSX_TO_STATE.get(element) as LineState;
    if (!element || !line || !symbol) {
      wrapped.push(element);
      continue;
    }
    // 执行到此处说明需要包装相关节点(即使仅单个节点)
    const nodes: JSX.Element[] = [element];
    for (let k = i + 1; k < len; ++k) {
      const next = elements[k];
      const nextSymbol = getWrapSymbol(keys, next);
      if (!next || !nextSymbol || nextSymbol !== symbol) {
        // 回退到上一个值, 以便下次循环时重新检查
        i = k - 1;
        break;
      }
      nodes.push(next);
      i = k;
    }
    // 通过插件渲染包装节点
    let wrapper: React.ReactNode = nodes;
    const op = line.op;
    for (const plugin of plugins) {
      // 这里的状态以首个节点为准
      const context: ReactWrapLineContext = {
        lineState: line,
        children: wrapper,
      };
      if (plugin.match(line.op.attributes || {}, op) && plugin.wrapLine) {
        wrapper = plugin.wrapLine(context);
      }
    }
    const key = `${i - nodes.length + 1}-${i}`;
    wrapped.push(<React.Fragment key={key}>{wrapper}</React.Fragment>);
  }
  return wrapped;
};

/**
 * 将行内叶子节点包装组合 O(N)
 * @param editor
 * @param elements
 */
export const withWrapLeafNodes = (editor: Editor, elements: JSX.Element[]): JSX.Element[] => {
  const wrapped: JSX.Element[] = [];
  const keys = EDITOR_TO_WRAP_LEAF_KEYS.get(editor);
  const plugins = EDITOR_TO_WRAP_LEAF_PLUGINS.get(editor);
  if (!keys || !plugins) return elements;
  const len = elements.length;
  for (let i = 0; i < len; ++i) {
    const element = elements[i];
    const symbol = getWrapSymbol(keys, element);
    const leaf = JSX_TO_STATE.get(element) as LeafState;
    if (!element || !leaf || !symbol) {
      wrapped.push(element);
      continue;
    }
    // 执行到此处说明需要包装相关节点(即使仅单个节点)
    const nodes: JSX.Element[] = [element];
    for (let k = i + 1; k < len; ++k) {
      const next = elements[k];
      const nextSymbol = getWrapSymbol(keys, next);
      if (!next || !nextSymbol || nextSymbol !== symbol) {
        // 回退到上一个值, 以便下次循环时重新检查
        i = k - 1;
        break;
      }
      nodes.push(next);
      i = k;
    }
    // 通过插件渲染包装节点
    let wrapper: React.ReactNode = nodes;
    const op = leaf.op;
    for (const plugin of plugins) {
      // 这里的状态以首个节点为准
      const context: ReactWrapLeafContext = {
        leafState: leaf,
        children: wrapper,
      };
      if (plugin.match(leaf.op.attributes || {}, op) && plugin.wrapLeaf) {
        wrapper = plugin.wrapLeaf(context);
      }
    }
    const key = `${i - nodes.length + 1}-${i}`;
    wrapped.push(<React.Fragment key={key}>{wrapper}</React.Fragment>);
  }
  return wrapped;
};
