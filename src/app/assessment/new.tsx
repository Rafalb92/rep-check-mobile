import { useEffect } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
} from "react-native-vision-camera";

export default function NewAssessment() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

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
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
    </View>
  );
}
