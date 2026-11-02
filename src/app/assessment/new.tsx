import { SwitchCamera } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Linking,
    Pressable,
    StyleSheet,
    Text,
    View,
    type LayoutChangeEvent,
} from "react-native";
import {
    Delegate,
    RunningMode,
    usePoseDetection,
} from "react-native-mediapipe-posedetection";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
} from "react-native-vision-camera";

type Phase = "idle" | "countdown" | "recording";
type CameraPosition = "back" | "front";
type PoseCallbacks = Parameters<typeof usePoseDetection>[0];
type PoseOptions = Parameters<typeof usePoseDetection>[3];

const COUNTDOWN_SECONDS = 5;
const DOT_SIZE = 16;

// Module-level constant: same object identity on every render,
// so the pose hook never sees a "new" configuration.
const POSE_OPTIONS: PoseOptions = { numPoses: 1, delegate: Delegate.GPU };

export default function NewAssessment() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>("back");
  const device = useCameraDevice(cameraPosition);

  // UI state (drives rendering)
  const [phase, setPhase] = useState<Phase>("idle");
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

  // Mutable mirrors read inside the pose callback (no re-render per frame)
  const phaseRef = useRef<Phase>("idle");
  const frameCounter = useRef(0);
  const recordingStartedAt = useRef(0);
  const viewSize = useRef({ width: 0, height: 0 });
  const frameInfoLogged = useRef(false);

  // Debug dot: shared values update the native view directly, bypassing React renders
  const dotX = useSharedValue(0);
  const dotY = useSharedValue(0);
  const dotOpacity = useSharedValue(0);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
    transform: [
      { translateX: dotX.value - DOT_SIZE / 2 },
      { translateY: dotY.value - DOT_SIZE / 2 },
    ],
  }));

  const updatePhase = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  // Countdown: derive remaining time from a fixed deadline, so timer drift
  // or a delayed tick never makes it run longer than 5 s.
  useEffect(() => {
    if (phase !== "countdown") return;

    const endsAt = Date.now() + COUNTDOWN_SECONDS * 1000;
    setSecondsLeft(COUNTDOWN_SECONDS);

    const id = setInterval(() => {
      const remaining = Math.ceil((endsAt - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(id);
        frameCounter.current = 0;
        recordingStartedAt.current = Date.now();
        console.log(`--- recording started (${cameraPosition} camera) ---`);
        updatePhase("recording");
        return;
      }
      setSecondsLeft(remaining);
    }, 200);

    return () => clearInterval(id);
  }, [phase, cameraPosition]);

  const startCountdown = () => updatePhase("countdown");

  const stopRecording = () => {
    const durationSec = (Date.now() - recordingStartedAt.current) / 1000;
    const frames = frameCounter.current;
    console.log(
      `--- recording stopped: ${frames} frames in ${durationSec.toFixed(1)} s (~${(frames / durationSec).toFixed(1)} fps) ---`,
    );
    updatePhase("idle");
  };

  const toggleCamera = () => {
    frameInfoLogged.current = false;
    setCameraPosition((p) => (p === "back" ? "front" : "back"));
  };

  // Empty deps are safe ONLY because the callbacks read refs and shared values
  // (stable containers). Reading React state here would freeze it at first render.
  const poseCallbacks = useMemo<PoseCallbacks>(
    () => ({
      onResults: (bundle, vc) => {
        const frameDims = vc.getFrameDims(bundle);

        if (!frameInfoLogged.current) {
          frameInfoLogged.current = true;
          console.log(
            `input image: ${bundle.inputImageWidth}x${bundle.inputImageHeight}  frameDims: ${frameDims.width}x${frameDims.height}  view: ${viewSize.current.width.toFixed(0)}x${viewSize.current.height.toFixed(0)}`,
          );
        }

        const person = bundle.results?.[0]?.landmarks?.[0];
        if (!person || person.length === 0) {
          dotOpacity.value = 0;
          return;
        }

        const nose = person[0];
        if (nose?.visibility == null) return;

        // Library coordinator: normalized landmark -> view pixels
        // (handles sensor rotation, front-camera mirroring and cover cropping)
        const viewPoint = vc.convertPoint(frameDims, { x: nose.x, y: nose.y });
        dotX.value = viewPoint.x;
        dotY.value = viewPoint.y;
        dotOpacity.value = 1;

        if (phaseRef.current === "recording") {
          frameCounter.current += 1;
        }
      },
      onError: (e) => console.error("pose error:", e.message),
    }),
    [],
  );

  const poseDetection = usePoseDetection(
    poseCallbacks,
    RunningMode.LIVE_STREAM,
    "pose_landmarker_lite.task",
    POSE_OPTIONS,
  );

  // Tell the coordinator which camera is active (sensor orientation + mirroring)
  useEffect(() => {
    poseDetection.cameraDeviceChangeHandler(device);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device]);

  // Tell the coordinator the preview fills the view with cropping
  useEffect(() => {
    poseDetection.resizeModeChangeHandler("cover");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCameraLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    viewSize.current = { width, height };
    poseDetection.cameraViewLayoutChangeHandler(e);
  };

  if (!hasPermission) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-8">
        <Text className="mb-6 text-center text-base text-muted">
          RepCheck needs camera access to record movement screens.
        </Text>
        <Pressable
          onPress={() => Linking.openSettings()}
          className="rounded-2xl bg-accent px-6 py-3"
        >
          <Text className="text-base font-medium text-accent-foreground">
            Open settings
          </Text>
        </Pressable>
      </View>
    );
  }

  if (device == null) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-base text-muted">No camera device found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        pixelFormat="rgb"
        resizeMode="cover"
        onLayout={onCameraLayout}
        frameProcessor={poseDetection.frameProcessor}
      />

      <Animated.View pointerEvents="none" style={[styles.dot, dotStyle]} />

      {phase === "countdown" && (
        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center"
        >
          <Text className="text-8xl font-bold text-white">{secondsLeft}</Text>
        </View>
      )}

      {phase === "recording" && (
        <View className="absolute left-0 right-0 top-16 items-center">
          <View className="flex-row items-center gap-2 rounded-full bg-black/60 px-4 py-2">
            <View className="h-3 w-3 rounded-full bg-red-500" />
            <Text className="font-semibold text-white">REC</Text>
          </View>
        </View>
      )}

      <View className="absolute bottom-12 left-0 right-0 flex-row items-center justify-center gap-4">
        {phase === "idle" && (
          <>
            <Pressable
              onPress={toggleCamera}
              className="h-14 w-14 items-center justify-center rounded-full bg-black/60"
            >
              <SwitchCamera color="#ffffff" size={24} />
            </Pressable>
            <Pressable
              onPress={startCountdown}
              className="rounded-2xl bg-accent px-8 py-4"
            >
              <Text className="text-base font-semibold text-accent-foreground">
                Start ({COUNTDOWN_SECONDS}s)
              </Text>
            </Pressable>
          </>
        )}

        {phase === "recording" && (
          <Pressable
            onPress={stopRecording}
            className="rounded-2xl bg-red-500 px-8 py-4"
          >
            <Text className="text-base font-semibold text-white">Stop</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: "absolute",
    left: 0,
    top: 0,
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#10b981",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
});
