// AppNavigator handles navigation between Auth and Main tabs
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthScreen from '../screens/AuthScreen';
import HomeFeedScreen from '../screens/HomeFeedScreen';
import CreateReportScreen from '../screens/CreateReportScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Dummy screens for Game and Community
function GameScreen() {
  return (
    <>
      <h1 style={{ textAlign: 'center', marginTop: 40 }}>Game (Coming Soon)</h1>
    </>
  );
}
function CommunityScreen() {
  return (
    <>
      <h1 style={{ textAlign: 'center', marginTop: 40 }}>Community (Coming Soon)</h1>
    </>
  );
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Game" component={GameScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Feed" component={HomeFeedScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  // const [userId, setUserId] = useState(null);
  // useEffect(() => {
  //   const checkUser = async () => {
  //     const id = await AsyncStorage.getItem('user_id');
  //     setUserId(id);
  //   };
  //   checkUser();
  // }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        {/* <Stack.Screen name="Main" component={MainTabs} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
