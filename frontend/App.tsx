import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuScreen from './screens/MenuScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import AccountScreen from './screens/AccountScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;