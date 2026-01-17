import { sleep } from "../src/native";
import { throttle } from "../src/throttle";

describe("throttle", () => {
  it("once", async () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 50);
    throttled();
    await sleep(150);
    expect(fn).toBeCalledTimes(2);
  });

  it("once no trailing", async () => {
    const fn = jest.fn();
    const throttled = throttle(fn, { wait: 50, trailing: false });
    throttled();
    await sleep(150);
    expect(fn).toBeCalledTimes(1);
  });

  it("once no leading", async () => {
    const fn = jest.fn();
    const throttled = throttle(fn, { wait: 50, leading: false });
    throttled();
    await sleep(150);
    expect(fn).toBeCalledTimes(1);
  });

  it("twice", async () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 50);
    throttled();
    await sleep(20);
    throttled();
    await sleep(150);
    // leading & trailing
    expect(fn).toBeCalledTimes(2);
  });

  it("multi", async () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 50);
    throttled();
    await sleep(20);
    throttled();
    throttled();
    throttled();
    throttled();
    throttled();
    await sleep(150);
    expect(fn).toBeCalledTimes(2);
  });

  it("multi dispatch", async () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 50);
    throttled();
    await sleep(20);
    throttled();
    await sleep(20);
    throttled();
    await sleep(20);
    throttled();
    await sleep(150);
    expect(fn).toBeCalledTimes(3);
  });

  it("keep args", async () => {
    const payload = { a: 1 };
    const fn = jest.fn(arg => expect(arg).toBe(payload));
    const throttled = throttle(fn, 50);
    throttled(payload);
    await sleep(120);
  });

  it("clone args", async () => {
    // MouseEvent 在 FF 上存在问题 https://github.com/lodash/lodash/issues/3126
    // 理论上需要在 throttled 时(非 invoke 时) 对参数进行 clone
    // 且必须要指定参数名, 仅 Object.assign 无法将 offsetX 等值拷贝到新对象
    const payload = { a: 1 };
    const fn = jest.fn((arg: typeof payload) => {
      expect(arg).not.toBe(payload);
      expect(arg).toEqual({ ...payload });
    });
    const throttled = throttle(fn, 50);
    throttled({ ...payload });
    await sleep(120);
  });

  it("flush", async () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 50);
    throttled();
    await sleep(20);
    throttled();
    throttled();
    throttled();
    throttled();
    throttled();
    expect(fn).toBeCalledTimes(1);
    throttled.flush();
    expect(fn).toBeCalledTimes(2);
    await sleep(100);
    expect(fn).toBeCalledTimes(2);
  });

  it("cancel", async () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 50);
    throttled();
    await sleep(20);
    throttled();
    throttled();
    throttled();
    throttled();
    throttled();
    expect(fn).toBeCalledTimes(1);
    throttled.cancel();
    expect(fn).toBeCalledTimes(1);
    await sleep(100);
    expect(fn).toBeCalledTimes(1);
  });
});
