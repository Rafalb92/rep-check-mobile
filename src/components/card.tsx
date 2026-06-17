import { type ReactNode } from 'react';
import { View } from 'react-native';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <View className={`bg-surface rounded-[16px] border border-border p-4 ${className}`}>
      {children}
    </View>
  );
}
