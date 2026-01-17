export class Literal {
  /**
   * 字符串: 安全地使用 HTML
   * @param str
   */
  public static escapeHtml(str: string) {
    const html = str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/'/g, "&#39;")
      .replace(/"/g, "&quot;");

    return html;
  }

  /**
   * 字符串: 字典序对比
   * @param a
   * @param b
   * @returns -1: a < b, 0: a = b, 1: a > b
   */
  public static compare(a: string, b: string): number {
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
      if (a.charCodeAt(i) < b.charCodeAt(i)) return -1;
      if (a.charCodeAt(i) > b.charCodeAt(i)) return 1;
    }
    const diff = a.length - b.length;
    return diff < 0 ? -1 : diff > 0 ? 1 : 0;
  }

  /**
   * 字符串: 关联 Number
   * - 类似于 Hash, 但不处理 Hash 冲突
   * @param str
   */
  public static numberify(str: string): number {
    let num = 0;
    for (let i = 0; i < str.length; i++) {
      num = num + str.charCodeAt(i);
    }
    return num;
  }
}
