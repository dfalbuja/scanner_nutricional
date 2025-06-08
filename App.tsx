import React from 'react';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BarcodeScannerScreen from './src/screens/BarcodeScannerScreen';
import HistorialScreen from './src/screens/HistorialScreen';
import ProductoScreen from './src/screens/ProductoScreen';
import { Ionicons } from '@expo/vector-icons'; // ← importante

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ScannerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Scanner" component={BarcodeScannerScreen} />
      <Stack.Screen name="Producto" component={ProductoScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Escanear') {
              iconName = 'scan';
            } else if (route.name === 'Historial') {
              iconName = 'list';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen
          name="Escanear"
          component={ScannerStack}
          options={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? 'Scanner';
            const hideHeader = routeName !== 'Scanner';
            return {
              headerShown: !hideHeader,
              title: 'Escanear',
            };
          }}
        />
        <Tab.Screen name="Historial" component={HistorialScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
