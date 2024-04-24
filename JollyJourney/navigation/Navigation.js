import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import Home from '../app/screens/Home';
import SignUp from '../app/screens/SignUp';
import SignIn from '../app/screens/SignIn';
import TabNavigator from './TabNavigator';
import Cities from '../app/screens/Explore/Cities';
import CreateGroup from '../app/screens/Groups/CreateGroup';
import GroupDetails from '../app/screens/Groups/GroupDetails';
import GroupTrip from '../app/screens/Groups/GroupTrip';
import Messages from '../app/screens/Chats/Messages';


const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return(
    <InsideStack.Navigator>

      <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Cities" component={Cities} options={{ headerShown: false }} />
      <Stack.Screen name="CreateGroup" component={CreateGroup} options={{ headerShown: false }} />
      <Stack.Screen name="GroupDetails" component={GroupDetails} options={{ headerShown: false }} />
      <Stack.Screen name="GroupTrip" component={GroupTrip} options={{ headerShown: false }} />
      <Stack.Screen name="Message" component={Messages} />

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
            <Stack.Screen name='SignUp' component={SignUp} options={{ headerShown: false }} />
            <Stack.Screen name='SignIn' component={SignIn} options={{ headerShown: false }} />
          </>
        )}
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

