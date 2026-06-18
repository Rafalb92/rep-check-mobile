import { useEffect } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import {
    Delegate,
    RunningMode,
    usePoseDetection,
} from "react-native-mediapipe-posedetection";
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
    useFrameProcessor,
} from "react-native-vision-camera";

export default function NewAssessment() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";
    console.log(`frame: ${frame.width}x${frame.height} ${frame.pixelFormat}`);
  }, []);

  const poseDetection = usePoseDetection(
    {
      onResults: (bundle) => {
        const person = bundle.results?.[0]?.landmarks?.[0];
        if (!person || person.length === 0) return;

        const nose = person[0];
        if (nose?.visibility == null) return; // odcina undefined

        console.log(
          "nose y:",
          nose.y.toFixed(3),
          "visible:",
          nose.visibility.toFixed(2),
        );
      },
      onError: (e) => console.error("pose error:", e.message),
    },
    RunningMode.LIVE_STREAM,
    "pose_landmarker_lite.task",
    { numPoses: 1, delegate: Delegate.GPU },
  );

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
        frameProcessor={poseDetection.frameProcessor}
      />
    </View>
  );
}
