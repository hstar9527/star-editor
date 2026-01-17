import type { LeafState } from "@block-kit/core";
import type { AttributeMap } from "@block-kit/delta";
import { Delta } from "@block-kit/delta";
import type { ReactLeafContext } from "@block-kit/react";
import { EditorPlugin, Embed } from "@block-kit/react";

import { SelectorInput } from "../components/selector-input";
import { SEL_KEY, SEL_OPTIONS_WIDTH, SEL_VALUE_KEY } from "../utils/constant";
import type { SelectorPluginOptions } from "../utils/types";

export class SelectorInputPlugin extends EditorPlugin {
  public key = SEL_KEY;
  public options: SelectorPluginOptions;

  constructor(options?: SelectorPluginOptions) {
    super();
    this.options = options || {};
  }

  public destroy(): void {
    // No specific cleanup needed for this plugin
  }

  public match(attrs: AttributeMap): boolean {
    return !!attrs[SEL_KEY];
  }

  public onValueChange(leaf: LeafState, v: string) {
    const rawRange = leaf.toRawRange();
    if (!rawRange) return void 0;
    const delta = new Delta().retain(rawRange.start).retain(rawRange.len, {
      [SEL_VALUE_KEY]: v,
    });
    this.editor.state.apply(delta, { autoCaret: false });
  }

  public renderLeaf(context: ReactLeafContext): React.ReactNode {
    const { attributes: attrs = {} } = context;
    const selKey = attrs[SEL_KEY];
    const value = attrs[SEL_VALUE_KEY] || "";
    const options = this.options.selector || {};
    return (
      <Embed context={context}>
        <SelectorInput
          value={value}
          optionsWidth={this.options.optionsWidth || SEL_OPTIONS_WIDTH}
          onChange={(v: string) => this.onValueChange(context.leafState, v)}
          options={options[selKey] || [value]}
        />
      </Embed>
    );
  }
}
