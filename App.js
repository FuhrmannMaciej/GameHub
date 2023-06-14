import React, { createContext, useState, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

import Chat from "./screens/Chat";
import Login from './screens/Login';
import SignUpStepOne from './screens/SignUpStepOne';
import SignUpStepTwo from './screens/SignUpStepTwo';
import Home from './screens/Home';
import CreateNewPost from './screens/CreateNewPost';
import colors from "./colors";
import SetAvatar from "./screens/SetAvatar";
import UserProfile from "./screens/UserProfile";

const Stack = createStackNavigator();
const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  )
}

function HomeStack() {
  return (
    <Stack.Navigator defaultScreenOptions={Home}
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTitle: '',
    }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="CreateNewPost" component={CreateNewPost} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
    </Stack.Navigator>
  )
}

function AuthStack() {
  return (
    <Stack.Navigator defaultScreenOptions={Login}>
      <Stack.Screen name='Login' component={Login} options={{ headerShown: false}}/>
      <Stack.Screen name='SignUpStepOne' component={SignUpStepOne} options={{ headerShown: false}}/>
      <Stack.Screen name='SignUpStepTwo' component={SignUpStepTwo} options={{ headerShown: false}}/>
      <Stack.Screen name='SetAvatar' component={SetAvatar} options={{ headerShown: false}}/>
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );
    return () => unsubscribeAuth();
  }, [user]);
if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

return (
    <NavigationContainer>
      {user ? <HomeStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}
