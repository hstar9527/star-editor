/* eslint-disable @typescript-eslint/ban-types */
import type { P } from "@block-kit/utils/dist/es/types";
import type { ComponentOptions, EmitsOptions, RenderFunction, SetupContext, SlotsType } from "vue";

export type FC<
  Props extends Record<string, P.Any>,
  E extends EmitsOptions = {},
  S extends SlotsType = {}
> = (props: Props, ctx: SetupContext<E, S>) => RenderFunction | Promise<RenderFunction>;

export type FCOptions<
  Props extends Record<string, P.Any>,
  E extends EmitsOptions = {},
  EE extends string = string,
  S extends SlotsType = {}
> = Pick<ComponentOptions, "name" | "inheritAttrs"> & {
  props?: (keyof Props)[];
  emits?: E | EE[];
  slots?: S;
};
