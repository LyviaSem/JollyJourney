import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Navigation from './navigation/Navigation';
import { UserProvider } from './context/UserContext';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

export default function App() {

  let [fontsLoaded] = useFonts({
    "Inter-Bold": require("./app/fonts/Inter-Bold.ttf"),
    "Inter-Regular": require('./app/fonts/Inter-Regular.ttf')
  })

  if(!fontsLoaded) {
    return <AppLoading/>;
  }

  return (
    <UserProvider> 
      <StatusBar style="auto" />
      <Navigation />
    </UserProvider> 
  );
}
