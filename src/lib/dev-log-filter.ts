/**
 * Drops noisy third-party debug logs in development.
 * react-native-mediapipe-posedetection logs on every frame (~28/s),
 * which drowns out our own diagnostics.
 */
const MUTED_PREFIXES = ["onResults event received"];

if (__DEV__) {
  const originalLog = console.log;

  console.log = (...args: unknown[]) => {
    const first = args[0];
    if (
      typeof first === "string" &&
      MUTED_PREFIXES.some((prefix) => first.startsWith(prefix))
    ) {
      return;
    }
    originalLog(...args);
  };
}

export { };
