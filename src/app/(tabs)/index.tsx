import { useRouter } from 'expo-router';
import { Camera } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { ListItemCard } from '@/components/list-item-card';
import { PrimaryCTA } from '@/components/primary-cta';
import { Screen } from '@/components/screen';
import { StatCard } from '@/components/stat-card';

const RECENT_ASSESSMENTS = [
  { id: '1', initials: 'JD', name: 'James Davis', movement: 'Squat', date: 'Jun 15', score: 82 },
  { id: '2', initials: 'SM', name: 'Sara Miller', movement: 'Deadlift', date: 'Jun 14', score: 61 },
  { id: '3', initials: 'RK', name: 'Ryan Kim', movement: 'Overhead Press', date: 'Jun 12', score: 44 },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Screen>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6 pt-2">
        <View>
          <Text className="text-muted text-sm font-medium">Good morning</Text>
          <Text className="text-foreground text-2xl font-bold mt-0.5">Coach Rafael</Text>
        </View>
        <View className="w-12 h-12 rounded-full bg-surface border border-border items-center justify-center">
          <Text className="text-foreground font-bold">RC</Text>
        </View>
      </View>

      {/* Primary CTA */}
      <PrimaryCTA
        label="New Assessment"
        sublabel="Capture & score a movement"
        icon={<Camera color="#10b981" size={22} />}
        onPress={() => router.push('/assessment/new')}
      />

      {/* Stats row */}
      <View className="flex-row gap-3 mt-4">
        <StatCard label="This week" value="7" />
        <StatCard label="Clients" value="24" />
      </View>

      {/* Recent section */}
      <View className="mt-6">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-foreground font-semibold text-base">Recent</Text>
          <Text className="text-accent text-sm font-medium">See all</Text>
        </View>

        <View className="gap-2">
          {RECENT_ASSESSMENTS.map((item) => (
            <ListItemCard
              key={item.id}
              initials={item.initials}
              name={item.name}
              movement={item.movement}
              date={item.date}
              score={item.score}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}
