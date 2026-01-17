import { debounce } from "../src/debounce";
import { sleep } from "../src/native";

describe("debounce", () => {
  it("once", async () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 50);
    debounced();
    await sleep(150);
    expect(fn).toBeCalledTimes(1);
  });

  it("once with leading", async () => {
    const fn = jest.fn();
    const debounced = debounce(fn, { wait: 50, leading: true });
    debounced();
    await sleep(150);
    expect(fn).toBeCalledTimes(2);
  });

  it("once no trailing", async () => {
    const fn = jest.fn();
    const debounced = debounce(fn, { wait: 50, trailing: false });
    debounced();
    await sleep(150);
    expect(fn).toBeCalledTimes(0);
  });

  it("twice", async () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 50);
    debounced();
    await sleep(20);
    debounced();
    await sleep(150);
    expect(fn).toBeCalledTimes(1);
  });

  it("multi", async () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 50);
    debounced();
    await sleep(20);
    debounced();
    debounced();
    debounced();
    debounced();
    debounced();
    await sleep(150);
    expect(fn).toBeCalledTimes(1);
  });

  it("multi dispatch", async () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 50);
    debounced();
    await sleep(60);
    debounced();
    await sleep(60);
    debounced();
    await sleep(150);
    expect(fn).toBeCalledTimes(3);
  });

  it("keep args", async () => {
    const payload = { a: 1 };
    const fn = jest.fn(arg => expect(arg).toBe(payload));
    const debounced = debounce(fn, 50);
    debounced(payload);
    await sleep(120);
  });

  it("clone args", async () => {
    // MouseEvent 在 FF 上存在问题 https://github.com/lodash/lodash/issues/3126
    // 理论上需要在 throttled 时(非 invoke 时) 对参数进行 clone
    // 且必须要指定参数名, 仅 Object.assign 无法将 offsetX 等值拷贝到新对象
    const payload = { a: 1 };
    const fn = jest.fn(arg => {
      expect(arg).not.toBe(payload);
      expect(arg).toEqual({ ...payload });
    });
    const debounced = debounce(fn, 50);
    debounced({ ...payload });
    await sleep(120);
  });

  it("flush", async () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 50);
    debounced();
    await sleep(20);
    debounced();
    expect(fn).toBeCalledTimes(0);
    debounced.flush();
    expect(fn).toBeCalledTimes(1);
    await sleep(100);
    expect(fn).toBeCalledTimes(1);
  });

  it("cancel", async () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 50);
    debounced();
    await sleep(20);
    debounced();
    debounced.cancel();
    expect(fn).toBeCalledTimes(0);
    await sleep(100);
    expect(fn).toBeCalledTimes(0);
  });
});
