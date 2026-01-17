/// <reference types="../../../utils/src/global.d.ts" />
import { sleep } from "@block-kit/utils";
import { act, render } from "@testing-library/react";

import {
  usePreviousEffect,
  useSafeState,
  useUpdateEffect,
  useUpdateLayoutEffect,
} from "../../../utils/src/hooks";

describe("hooks effect", () => {
  it("update effect", async () => {
    const spy = jest.fn();
    let action!: readonly [number, (next: number) => void];
    const App = () => {
      const _action = useSafeState(0);
      action = _action;
      useUpdateEffect(() => {
        spy();
      }, [_action[0]]);
      return <div>{_action[0]}</div>;
    };
    render(<App />);
    await act(async () => {
      action[1](1);
      await sleep(10);
      action[1](2);
      await sleep(10);
    });
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("update layout effect", async () => {
    const spy = jest.fn();
    let action!: readonly [number, (next: number) => void];
    const App = () => {
      const _action = useSafeState(0);
      action = _action;
      useUpdateLayoutEffect(() => {
        spy();
      }, [_action[0]]);
      return <div>{_action[0]}</div>;
    };
    render(<App />);
    await act(async () => {
      action[1](1);
      await sleep(10);
      action[1](2);
      await sleep(10);
    });
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("update previous effect", async () => {
    const spy = jest.fn();
    const cleanSpy = jest.fn();
    let action!: readonly [number, (next: number) => void];
    const App = () => {
      const _action = useSafeState(0);
      action = _action;
      usePreviousEffect(
        (prev, current) => {
          if (prev === undefined) expect(current?.[0]).toBe(0);
          if (prev?.[0] === 0) expect(current?.[0]).toBe(1);
          if (prev?.[0] === 1) expect(current?.[0]).toBe(2);
          spy();
          return () => {
            cleanSpy();
          };
        },
        [_action[0]]
      );
      return <div>{_action[0]}</div>;
    };
    const dom = render(<App />);
    await act(async () => {
      action[1](1);
      await sleep(10);
      action[1](2);
      await sleep(10);
      dom.unmount();
      await sleep(10);
    });
    expect(spy).toHaveBeenCalledTimes(3);
    expect(cleanSpy).toHaveBeenCalledTimes(3);
  });
});
