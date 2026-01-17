import type { O } from "@block-kit/utils/dist/es/types";

export type EditablePluginOptions = {
  placeholders?: O.Map<string>;
};

export type SelectorPluginOptions = {
  selector?: O.Map<string[]>;
  optionsWidth?: number;
};
