export const PLUGIN_EVENTS = {
  SHORTCUT_MARKS_CHANGE: "SHORTCUT_MARKS_CHANGE",
} as const;

declare module "@block-kit/core/dist/es/event/bus/types" {
  interface EventMapExtension {
    [PLUGIN_EVENTS.SHORTCUT_MARKS_CHANGE]: null;
  }
}
