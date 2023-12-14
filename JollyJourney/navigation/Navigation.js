import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import Home from '../app/screens/Home';
import Inscription from '../app/screens/Inscription';
import Connexion from '../app/screens/Connexion';
import TabNavigator from './TabNavigator';
import VillesDescription from '../app/screens/VillesDescription';


const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return(
    <InsideStack.Navigator>
      <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Villes" component={VillesDescription} options={{ headerShown: false }} />
    </InsideStack.Navigator>
  )
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log(user)
    });
    
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        
        {user ? (
          <Stack.Screen name='Inside' component={InsideLayout} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
            <Stack.Screen name='Inscription' component={Inscription} options={{ headerShown: false }} />
            <Stack.Screen name='Connexion' component={Connexion} options={{ headerShown: false }} />
          </>
        )}
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

