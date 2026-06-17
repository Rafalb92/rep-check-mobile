import { type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenProps {
  children: ReactNode;
  scrollable?: boolean;
}

export function Screen({ children, scrollable = true }: ScreenProps) {
  const insets = useSafeAreaInsets();

  const content = (
    <View
      className="flex-1 bg-background px-4"
      style={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 }}>
      {children}
    </View>
  );

  if (!scrollable) return content;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 }}
      showsVerticalScrollIndicator={false}>
      <View className="px-4">{children}</View>
    </ScrollView>
  );
}
