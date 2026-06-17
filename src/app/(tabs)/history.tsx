import { Text, View } from 'react-native';

import { ListItemCard } from '@/components/list-item-card';
import { Screen } from '@/components/screen';

const HISTORY = [
  { id: '1', initials: 'JD', name: 'James Davis', movement: 'Squat', date: 'Jun 15', score: 82 },
  { id: '2', initials: 'SM', name: 'Sara Miller', movement: 'Deadlift', date: 'Jun 14', score: 61 },
  { id: '3', initials: 'RK', name: 'Ryan Kim', movement: 'Overhead Press', date: 'Jun 12', score: 44 },
  { id: '4', initials: 'AL', name: 'Amy Lee', movement: 'Squat', date: 'Jun 11', score: 78 },
  { id: '5', initials: 'TC', name: 'Tom Chen', movement: 'Lunge', date: 'Jun 10', score: 55 },
  { id: '6', initials: 'JD', name: 'James Davis', movement: 'Hip Hinge', date: 'Jun 9', score: 90 },
];

export default function HistoryScreen() {
  return (
    <Screen>
      <View className="pt-2 mb-6">
        <Text className="text-foreground text-2xl font-bold">History</Text>
        <Text className="text-muted text-sm mt-1">All past assessments</Text>
      </View>

      <View className="gap-2">
        {HISTORY.map((item) => (
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
    </Screen>
  );
}
