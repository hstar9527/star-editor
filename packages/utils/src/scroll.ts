export class Scroll {
  /** 滚动标识 */
  public static instant = "instant" as const;

  /**
   * X 轴滚动指定距离
   * @param scroll
   * @param deltaX
   */
  public static scrollDeltaX(scroll: Element | Window, deltaX: number) {
    if (scroll instanceof Window) {
      scroll.scrollTo({ top: scroll.scrollX + deltaX, behavior: Scroll.instant });
    } else {
      const left = scroll.scrollLeft + deltaX;
      scroll.scrollLeft = left;
    }
  }

  /**
   * Y 轴滚动指定距离
   * @param scroll
   * @param deltaY
   */
  public static scrollDeltaY(scroll: Element | Window, deltaY: number) {
    if (scroll instanceof Window) {
      scroll.scrollTo({ top: scroll.scrollY + deltaY, behavior: Scroll.instant });
    } else {
      const top = scroll.scrollTop + deltaY;
      scroll.scrollTop = top;
    }
  }

  /**
   * 滚动元素到可视区域 - X 方向
   * @param scroll
   * @param target
   * @param options
   */
  public static scrollIntoViewX(
    scroll: Element | Window,
    target: Element,
    options?: { threshold?: number }
  ) {
    const { threshold = 0 } = options || {};
    if (!target || !scroll) return void 0;
    const targetRect = target.getBoundingClientRect();
    if (scroll instanceof Window) {
      const left = scroll.scrollX + targetRect.left - threshold;
      scroll.scrollTo({ left, behavior: Scroll.instant });
    } else {
      const scrollRect = scroll.getBoundingClientRect();
      const nodeLeft = scroll.scrollLeft + targetRect.left - scrollRect.left;
      scroll.scrollLeft = nodeLeft - threshold;
    }
  }

  /**
   * 滚动元素到可视区域 - Y 方向
   * @param scroll
   * @param target
   * @param options
   */
  public static scrollIntoViewY(
    scroll: Element | Window,
    target: Element,
    options?: { threshold?: number }
  ) {
    const { threshold = 0 } = options || {};
    if (!target || !scroll) return void 0;
    const targetRect = target.getBoundingClientRect();
    if (scroll instanceof Window) {
      const top = scroll.scrollY + targetRect.top - threshold;
      scroll.scrollTo({ top, behavior: Scroll.instant });
    } else {
      const scrollRect = scroll.getBoundingClientRect();
      /**
       * ---------- scroll top      --------------
       * |        |                              |
       * ---------- scroll bottom             node top
       * |        |                              |
       * ---------- target top      --------------
       */
      const nodeTop = scroll.scrollTop + targetRect.top - scrollRect.top;
      scroll.scrollTop = nodeTop - threshold;
    }
  }

  /**
   * 检查元素 X 轴溢出
   * @param dom
   */
  public static isOverflowX(dom: Element): boolean {
    if (!dom) return false;
    const rect = dom.getBoundingClientRect();
    return dom.scrollWidth > rect.width;
  }

  /**
   * 检查元素 Y 轴溢出
   * @param dom
   */
  public static isOverflowY(dom: Element): boolean {
    if (!dom) return false;
    const rect = dom.getBoundingClientRect();
    return dom.scrollHeight > rect.height;
  }

  /**
   * 检查元素是否接近顶部
   * @param  dom
   * @param threshold
   */
  public static isCloseToTop(dom: Element, threshold = 0): boolean {
    return dom.scrollTop <= threshold;
  }

  /**
   * 检查元素是否接近底部
   * @param dom
   * @param threshold
   */
  public static isCloseToBottom(dom: Element, threshold: number = 0): boolean {
    return dom.scrollHeight - dom.scrollTop - dom.clientHeight <= threshold;
  }

  /**
   * 检查元素是否接近左侧
   * @param dom
   * @param threshold
   */
  public static isCloseToLeft(dom: Element, threshold: number = 0): boolean {
    return dom.scrollLeft <= threshold;
  }

  /**
   * 检查元素是否接近右侧
   * @param dom
   * @param threshold
   */
  public static isCloseToRight(dom: Element, threshold: number = 0): boolean {
    return dom.scrollWidth - dom.scrollLeft - dom.clientWidth <= threshold;
  }
}
