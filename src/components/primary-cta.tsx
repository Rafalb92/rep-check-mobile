import { type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

interface PrimaryCTAProps {
  label: string;
  sublabel?: string;
  icon?: ReactNode;
  onPress?: () => void;
}

export function PrimaryCTA({ label, sublabel, icon, onPress }: PrimaryCTAProps) {
  return (
    <Pressable
      onPress={onPress}
      className="active:opacity-80"
      style={{ minHeight: 80 }}>
      <View className="bg-accent rounded-[16px] p-5 flex-row items-center gap-4">
        {icon && (
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(4,36,28,0.3)' }}>
            {icon}
          </View>
        )}
        <View className="flex-1">
          <Text className="text-accent-foreground font-bold text-lg">{label}</Text>
          {sublabel && (
            <Text className="text-sm mt-0.5" style={{ color: '#04241caa' }}>{sublabel}</Text>
          )}
        </View>
        <Text className="text-accent-foreground text-2xl font-light">›</Text>
      </View>
    </Pressable>
  );
}
