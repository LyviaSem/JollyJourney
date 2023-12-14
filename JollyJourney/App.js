import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Navigation from './navigation/Navigation';
import { UserProvider } from './context/UserContext';

export default function App() {
  return (
    <>
      <UserProvider> 
        <StatusBar style="auto" />
        <Navigation />
      </UserProvider> 
    </>
  );
}
