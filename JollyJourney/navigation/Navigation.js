import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import Home from '../app/screens/Home';
import SignUp from '../app/screens/SignUp';
import SignIn from '../app/screens/SignIn';
import TabNavigator from './TabNavigator';
import Messages from '../app/screens/Chats/Messages';
import CreateTravel from '../app/screens/Travel/CreateTravel';
import GroupDetails from '../app/screens/Groups/GroupDetails';




const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>

        
        {user ? (
          <>
           <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
           <Stack.Screen name="GroupDetails" component={GroupDetails} options={{ headerShown: false }} />
           <Stack.Screen name="Message" component={Messages} />
           <Stack.Screen name="CreateTravel" component={CreateTravel} options={{ headerShown: false }} />
           </>
        ) : (
          <>
            <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
            <Stack.Screen name='SignUp' component={SignUp} options={{ headerShown: false }} />
            <Stack.Screen name='SignIn' component={SignIn} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

