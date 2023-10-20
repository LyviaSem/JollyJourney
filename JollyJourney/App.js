import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {

  const [message, setmessage] = useState('')

  useEffect(() => {
    fetch('https://jolly-journey-3o4dnumtc-lyvias-projects.vercel.app/api/message')
    .then((response) => response.json())
    .then((data) => setmessage(data.message))
    .catch((error) => console.error('Erreur:', error));
  }, [])


  return (
    <View style={styles.container}>
      <Text>Hello World</Text>
      <Text>{message}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
