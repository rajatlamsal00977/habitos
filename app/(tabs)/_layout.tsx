import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import {
  FLOATING_TAB_BAR_HEIGHT,
  FLOATING_TAB_BAR_SIDE_MARGIN,
  floatingTabBarBottomOffset,
} from '@/constants/layout';
import { syncDailyReminderFromStore } from '@/lib/notifications/daily-reminder';
import { useHabitStore } from '@/store/useHabitStore';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={22} style={{ marginBottom: 2 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const bottomOffset = floatingTabBarBottomOffset(Math.max(insets.bottom, 8));
  const hydrated = useHabitStore((s) => s.hydrated);
  const habits = useHabitStore((s) => s.habits);
  const userSetup = useHabitStore((s) => s.userSetup);

  useEffect(() => {
    if (!hydrated) return;
    void syncDailyReminderFromStore(() => {
      const { hydrated: h, habits: ha, userSetup: u } = useHabitStore.getState();
      return { hydrated: h, habits: ha, userSetup: u };
    });
  }, [hydrated, habits, userSetup]);

  const tabBarBackground = () =>
    Platform.OS === 'web' ? (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor:
              colorScheme === 'dark' ? 'rgba(27,28,36,0.94)' : 'rgba(255,255,255,0.92)',
            borderRadius: 999,
          },
        ]}
      />
    ) : (
      <BlurView
        intensity={colorScheme === 'dark' ? 42 : 52}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        style={[StyleSheet.absoluteFill, { borderRadius: 999, overflow: 'hidden' }]}
      />
    );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.tint,
        tabBarInactiveTintColor: palette.tabIconDefault,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 6,
        },
        tabBarItemStyle: {
          paddingTop: 8,
          height: FLOATING_TAB_BAR_HEIGHT - 4,
        },
        tabBarStyle: {
          position: 'absolute',
          left: FLOATING_TAB_BAR_SIDE_MARGIN,
          right: FLOATING_TAB_BAR_SIDE_MARGIN,
          bottom: bottomOffset,
          height: FLOATING_TAB_BAR_HEIGHT,
          borderRadius: 999,
          overflow: 'hidden',
          borderTopWidth: 0,
          backgroundColor: colorScheme === 'dark' ? 'rgba(27,28,36,0.72)' : 'rgba(255,255,255,0.72)',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor:
            colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          paddingHorizontal: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: colorScheme === 'dark' ? 0.35 : 0.08,
          shadowRadius: 24,
          elevation: 12,
        },
        tabBarBackground,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => <TabBarIcon name="sun-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: 'Journey',
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
