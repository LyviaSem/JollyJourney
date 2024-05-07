import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import Home from '../app/screens/Home';
import SignUp from '../app/screens/SignUp';
import SignIn from '../app/screens/SignIn';
import TabNavigator from './TabNavigator';
import Cities from '../app/screens/Explore/Cities';
import GroupSelectMembers from '../app/screens/Groups/GroupSelectMembers';
import GroupDetails from '../app/screens/Groups/GroupDetails';
import GroupTrip from '../app/screens/Groups/GroupTrip';
import Messages from '../app/screens/Chats/Messages';
import GroupInfo from '../app/screens/Groups/GroupInfo';
import Groups from '../app/screens/Groups/Groups';
import CreateTravel from '../app/screens/Travel/CreateTravel';


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
           <Stack.Screen name="Cities" component={Cities} options={{ headerShown: false }} />
           <Stack.Screen name="GroupDetails" component={GroupDetails} options={{ headerShown: false }} />
           <Stack.Screen name="GroupSelectMembers" component={GroupSelectMembers} options={{ headerShown: false }} />
           <Stack.Screen name="GroupTrip" component={GroupTrip} options={{ headerShown: false }} />
           <Stack.Screen name="GroupInfo" component={GroupInfo} options={{ headerShown: false }} />
           <Stack.Screen name="CreateTravel" component={CreateTravel} options={{ headerShown: false }} />
           <Stack.Screen name="Message" component={Messages} options={{ headerShown: false }} />
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

