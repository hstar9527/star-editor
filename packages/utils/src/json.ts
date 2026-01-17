/**
 * Decode JSON String To Object
 * @param {string} value
 * @returns {T | null}
 */
export const decode = <T = unknown>(value: string): T | null => {
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.log("Decode JSON Error:", error);
  }
  return null;
};

/**
 * Encode JSON Object To String
 * @param {unknown} value
 * @returns {string | null}
 */
export const encode = (value: unknown): string | null => {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.log("Encode JSON Error:", error);
  }
  return null;
};

export const TSON = {
  /**
   * Decode JSON String To Object
   * @param {string} value
   * @returns {T | null}
   */
  decode: decode,
  /**
   * Encode JSON Object To String
   * @param {unknown} value
   * @returns {string | null}
   */
  encode: encode,
  /**
   * Parse JSON String To Object
   * @param {string} value
   * @returns {T | null}
   */
  parse: decode,
  /**
   * Stringify JSON Object To String
   * @param {unknown} value
   * @returns {string | null}
   */
  stringify: encode,
};
