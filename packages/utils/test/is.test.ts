import {
  isArray,
  isEmpty,
  isFunction,
  isNumber,
  isObject,
  isPlainNumber,
  isPlainObject,
  isString,
} from "../src/is";

describe("is", () => {
  it("is object", () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(1)).toBe(false);
    expect(isObject("")).toBe(false);
    expect(isObject(true)).toBe(false);
  });

  it("is array", () => {
    expect(isArray([])).toBe(true);
    expect(isArray({})).toBe(false);
    expect(isArray(null)).toBe(false);
    expect(isArray(undefined)).toBe(false);
    expect(isArray(1)).toBe(false);
    expect(isArray("")).toBe(false);
    expect(isArray(true)).toBe(false);
  });

  it("is number", () => {
    expect(isNumber(1.2)).toBe(true);
    expect(isNumber(1)).toBe(true);
    expect(isNumber(NaN)).toBe(true);
    expect(isNumber("1.1")).toBe(false);
    expect(isNumber("1")).toBe(false);
    expect(isNumber([])).toBe(false);
    expect(isNumber({})).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber(true)).toBe(false);
  });

  it("is plain number", () => {
    expect(isPlainNumber(1.2)).toBe(true);
    expect(isPlainNumber("1.1")).toBe(true);
    expect(isPlainNumber("1")).toBe(true);
    expect(isPlainNumber("-1.1")).toBe(true);
    expect(isPlainNumber(1)).toBe(true);
    expect(isPlainNumber([])).toBe(false);
    expect(isPlainNumber({})).toBe(false);
    expect(isPlainNumber(null)).toBe(false);
    expect(isPlainNumber(undefined)).toBe(false);
    expect(isPlainNumber("")).toBe(false);
    expect(isPlainNumber(true)).toBe(false);
  });

  it("is array", () => {
    expect(isString("")).toBe(true);
    expect(isString([])).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
    expect(isString(1)).toBe(false);
    expect(isString(true)).toBe(false);
  });

  it("is plain object", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(Object.create(null))).toBe(true);
    expect(isPlainObject(new (class extends Object {})())).toBe(false);
  });

  it("is function", () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function () {})).toBe(true);
    expect(isFunction(class {})).toBe(true);
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction(undefined)).toBe(false);
    expect(isFunction(1)).toBe(false);
    expect(isFunction(true)).toBe(false);
  });

  it("is empty", () => {
    expect(isEmpty("")).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty(1)).toBe(false);
    expect(isEmpty(true)).toBe(false);
  });
});
