import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import PillNavigation from '@/components/PillNavigation';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide default tab bar
        }}
        initialRouteName="class-selection"
      >
        <Tabs.Screen
          name="class-selection"
          options={{
            title: 'Class Selection',
          }}
        />
        <Tabs.Screen
          name="activity"
          options={{
            title: 'Activity',
          }}
        />
        <Tabs.Screen
          name="homework"
          options={{
            title: 'Homework',
          }}
        />
      </Tabs>
      <PillNavigation />
    </View>
  );
}
