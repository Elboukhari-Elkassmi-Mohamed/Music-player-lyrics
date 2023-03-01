import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// screens
import HomeScreen from './screens/HomeScreen';
import MusicScreen from './screens/MusicScreen';
import SettingsScreen from './screens/SettingsScreen';
import WatchScreen from './screens/WatchScreen';
import MusicPlayerScreen from './screens/MusicPlayerScreen';

// route names
const HomeN = 'Home';
const MusicN = 'Music';
const SettingsN = 'Settings';
const WatchN = 'Watch';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MusicStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MusicN" component={MusicScreen} options={{ headerShown: false}} />
      <Stack.Screen name="MusicPlayer" component={MusicPlayerScreen}  />
    </Stack.Navigator>
  );
}

export default function MainContainer() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={HomeN}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === HomeN) {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === MusicN) {
              iconName = focused ? 'musical-notes' : 'musical-notes-outline';
            }  else if (route.name === WatchN) {
              iconName = focused ? 'logo-youtube' : 'logo-youtube';
            } else if (route.name === SettingsN) {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0D499E',
          tabBarInactiveTintColor: 'black',
          tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
          tabBarStyle: { display: 'flex' }
        })}
      >
        <Tab.Screen name={HomeN} component={HomeScreen} />
        <Tab.Screen name={MusicN} component={MusicStack} options={{ headerShown: false}}/>
        <Tab.Screen name={SettingsN} component={SettingsScreen} />
        <Tab.Screen name={WatchN} component={WatchScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
