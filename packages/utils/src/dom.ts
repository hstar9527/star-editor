import DOMNode = globalThis.Node;
import DOMText = globalThis.Text;
import DOMElement = globalThis.Element;

/**
 * 检查 DOM 节点
 * @param value
 */
export const isDOMNode = (value: unknown): value is DOMNode => {
  return value instanceof Node;
};

/**
 * 检查 DOM 文本节点
 * @param value
 */
export const isDOMText = (value: unknown): value is DOMText => {
  return isDOMNode(value) && value.nodeType === DOMNode.TEXT_NODE;
};

/**
 * 检查 DOM 元素节点
 * @param value
 */
export const isDOMElement = (value: unknown): value is DOMElement => {
  return isDOMNode(value) && value.nodeType === DOMNode.ELEMENT_NODE;
};

/**
 * 检查 DOM 注释节点
 * @param value
 */
export const isDOMComment = (value: unknown): value is Comment => {
  return isDOMNode(value) && value.nodeType === DOMNode.COMMENT_NODE;
};

/**
 * 检查 DOM 文档节点
 * @param value
 */
export const isHTMLElement = (value: unknown): value is HTMLElement => {
  return isDOMNode(value) && value instanceof HTMLElement;
};

/**
 * 获取焦点元素
 */
export const getActiveElement = () => {
  let activeElement = document.activeElement;

  while (activeElement && activeElement.shadowRoot && activeElement.shadowRoot.activeElement) {
    activeElement = activeElement.shadowRoot.activeElement;
  }

  return activeElement;
};

/**
 * 阻止事件冒泡
 * @param event
 */
export const stopNativeEvent = (
  event: Pick<Event, "stopPropagation"> & Partial<Pick<Event, "stopImmediatePropagation">>
) => {
  event.stopPropagation();
  event.stopImmediatePropagation && event.stopImmediatePropagation();
};

/**
 * 阻止事件默认行为与冒泡
 * @param event
 */
export const preventNativeEvent = (
  event: Pick<Event, "preventDefault" | "stopPropagation"> &
    Partial<Pick<Event, "stopImmediatePropagation">>
) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation && event.stopImmediatePropagation();
};

/**
 * 检查是否为特定键码
 * @param event
 * @param code
 */
export const isKeyCode = (event: KeyboardEvent, code: number) => {
  return event.keyCode === code;
};
