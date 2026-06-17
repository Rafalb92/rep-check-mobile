import { Text, View } from 'react-native';

import { Card } from '@/components/card';
import { Screen } from '@/components/screen';

const CLIENTS = [
  { id: '1', initials: 'JD', name: 'James Davis', plan: 'Strength & Mobility', sessions: 12 },
  { id: '2', initials: 'SM', name: 'Sara Miller', plan: 'Athletic Performance', sessions: 8 },
  { id: '3', initials: 'RK', name: 'Ryan Kim', plan: 'Injury Rehab', sessions: 20 },
  { id: '4', initials: 'AL', name: 'Amy Lee', plan: 'Strength & Mobility', sessions: 5 },
  { id: '5', initials: 'TC', name: 'Tom Chen', plan: 'General Fitness', sessions: 3 },
];

export default function ClientsScreen() {
  return (
    <Screen>
      <View className="pt-2 mb-6">
        <Text className="text-foreground text-2xl font-bold">Clients</Text>
        <Text className="text-muted text-sm mt-1">{CLIENTS.length} active clients</Text>
      </View>

      <View className="gap-3">
        {CLIENTS.map((client) => (
          <Card key={client.id}>
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full bg-border items-center justify-center">
                <Text className="text-foreground font-semibold text-sm">{client.initials}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-semibold text-base">{client.name}</Text>
                <Text className="text-muted text-sm">{client.plan}</Text>
              </View>
              <View className="items-end">
                <Text className="text-foreground font-bold text-lg">{client.sessions}</Text>
                <Text className="text-muted text-xs">sessions</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
