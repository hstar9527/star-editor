export const preventNativeEvent = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
};
