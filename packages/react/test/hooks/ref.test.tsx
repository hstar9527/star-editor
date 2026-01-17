/// <reference types="../../../utils/src/global.d.ts" />
import { act, render } from "@testing-library/react";

import { useStateRef } from "../../../utils/src/hooks";

describe("hooks ref", () => {
  it("state ref", async () => {
    let action!: readonly [number, (next: number) => void, React.MutableRefObject<number>];
    const App = () => {
      const _action = useStateRef(0);
      action = _action;
      return <div>{_action[0]}</div>;
    };
    const dom = render(<App />);
    const spy = jest.fn();
    act(() => {
      dom.unmount();
      const error = console.error;
      console.error = spy;
      action?.[1](10);
      console.error = error;
    });
    expect(action?.[0]).toBe(0);
    expect(action?.[2].current).toBe(10);
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
