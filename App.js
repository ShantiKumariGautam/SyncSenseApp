// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import WelcomeScreen from './screens/WelcomeScreen'; // ✅ Correct name
import TapScreen from './screens/TapScreen';
import SwipeScreen from './screens/SwipeScreen';
import ScrollScreen from './screens/ScrollScreen';
import ThankYouScreen from './screens/ThankYouScreen';
import ExportScreen from './screens/ExportScreen'; // ✅ New

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
          />
          <Stack.Screen
            name="TapScreen"
            component={TapScreen}
          />
          <Stack.Screen
            name="SwipeScreen"
            component={SwipeScreen}
          />
          <Stack.Screen
            name="ScrollScreen"
            component={ScrollScreen}
          />
          <Stack.Screen
            name="ThankYouScreen"
            component={ThankYouScreen}
          />
          <Stack.Screen
            name="ExportScreen"
            component={ExportScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
