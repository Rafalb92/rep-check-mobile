import { Text, View } from 'react-native';

interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <View className="flex-1 bg-surface rounded-[16px] border border-border p-4 gap-1">
      <Text className="text-muted text-xs font-medium uppercase tracking-wider">{label}</Text>
      <Text className="text-foreground text-2xl font-bold">{value}</Text>
    </View>
  );
}
