import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import AdminScreen from '../screens/AdminScreen';

const Stack = createStackNavigator();

const AppNavigator = ({ theme }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: theme.primary },
          headerTintColor: theme.text,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          initialParams={{ theme }} // Pass theme to LoginScreen
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          initialParams={{ theme }} // Pass theme to RegisterScreen
          options={{ title: 'Register' }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{ theme }} // Pass theme to HomeScreen
          options={{ title: 'Barcode Scanner' }}
        />
        <Stack.Screen
          name="Admin"
          component={AdminScreen}
          initialParams={{ theme }} // Pass theme to AdminScreen
          options={{ title: 'Admin Dashboard' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;