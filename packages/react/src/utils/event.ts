export const preventNativeEvent = (event: {
  preventDefault: Event["preventDefault"];
  stopPropagation: Event["stopPropagation"];
  stopImmediatePropagation?: Event["stopImmediatePropagation"];
}) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation && event.stopImmediatePropagation();
};

export const preventReactEvent = (event: React.SyntheticEvent) => {
  preventNativeEvent(event);
  preventNativeEvent(event.nativeEvent);
};
