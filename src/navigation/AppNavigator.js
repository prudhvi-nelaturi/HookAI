import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ScriptScreen from '../screens/ScriptScreen';
import HistoryScreen from '../screens/HistoryScreen';
import { Colors } from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.card,
            borderTopColor: Colors.border,
            paddingBottom: 8,
            paddingTop: 8,
            height: 65,
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        }}
      >
        <Tab.Screen
          name="Ideas"
          component={HomeScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>💡</Text> }}
        />
        <Tab.Screen
          name="Script"
          component={ScriptScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📝</Text> }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📂</Text> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
