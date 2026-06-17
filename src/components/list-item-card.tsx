import { Text, View } from 'react-native';

interface ListItemCardProps {
  initials: string;
  name: string;
  movement: string;
  date: string;
  score: number;
}

function scoreBadgeClass(score: number): string {
  if (score >= 75) return 'bg-accent';
  if (score >= 50) return 'bg-warning';
  return 'bg-danger';
}

function scoreBadgeTextClass(score: number): string {
  if (score >= 75) return 'text-accent-foreground';
  return 'text-foreground';
}

export function ListItemCard({ initials, name, movement, date, score }: ListItemCardProps) {
  return (
    <View className="bg-surface rounded-[16px] border border-border p-4 flex-row items-center gap-3">
      <View className="w-12 h-12 rounded-full bg-border items-center justify-center">
        <Text className="text-foreground font-semibold text-sm">{initials}</Text>
      </View>

      <View className="flex-1">
        <Text className="text-foreground font-semibold text-base" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-muted text-sm" numberOfLines={1}>
          {movement} · {date}
        </Text>
      </View>

      <View className={`px-2 py-1 rounded-full ${scoreBadgeClass(score)}`}>
        <Text className={`text-xs font-bold ${scoreBadgeTextClass(score)}`}>{score}</Text>
      </View>
    </View>
  );
}
