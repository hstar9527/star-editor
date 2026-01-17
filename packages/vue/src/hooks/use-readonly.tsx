import { inject } from "vue";

export const ReadonlyContext = Symbol();

export const useReadonly = () => {
  const readonly = inject<boolean>(ReadonlyContext);

  return { readonly };
};
