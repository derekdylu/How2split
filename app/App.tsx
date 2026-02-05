import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastProvider } from './contexts/ToastContext';
import { LocaleProvider } from './contexts/LocaleContext';
import { Header } from './components/Header';
import { Info } from './components/Info';
import { Create } from './screens/Create';
import { Event } from './screens/Event';
import { About } from './screens/About';
import { Error } from './screens/Error';

export type RootStackParamList = {
  Create: undefined;
  About: undefined;
  Event: { id: string };
  Error: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function Main() {
  const [openInfoModal, setOpenInfoModal] = useState(false);
  return (
    <>
      <StatusBar style="auto" />
      <Header onOpenInfo={() => setOpenInfoModal(true)} />
      <Info visible={openInfoModal} onClose={() => setOpenInfoModal(false)} />
      <Stack.Navigator
        initialRouteName="Create"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' },
        }}
      >
        <Stack.Screen name="Create" component={Create} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="Event" component={Event} />
        <Stack.Screen name="Error" component={Error} />
      </Stack.Navigator>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <LocaleProvider>
        <ToastProvider>
          <NavigationContainer>
            <Main />
          </NavigationContainer>
        </ToastProvider>
      </LocaleProvider>
    </SafeAreaProvider>
  );
}
