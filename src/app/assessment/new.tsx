import { useRouter } from 'expo-router';
import { Camera, ChevronLeft } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NewAssessmentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-border">
        <Pressable
          onPress={() => router.back()}
          className="active:opacity-70"
          style={{ minWidth: 48, minHeight: 48, justifyContent: 'center' }}>
          <ChevronLeft color="#f1f5f9" size={24} />
        </Pressable>
        <Text className="text-foreground font-semibold text-base ml-2">New Assessment</Text>
      </View>

      {/* Placeholder body */}
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <View className="w-20 h-20 rounded-full bg-surface border border-border items-center justify-center">
          <Camera color="#8a97a6" size={32} />
        </View>
        <Text className="text-foreground text-xl font-bold">Camera coming soon</Text>
        <Text className="text-muted text-sm text-center">
          Movement capture and AI scoring will be available in the next build.
        </Text>
      </View>
    </View>
  );
}
