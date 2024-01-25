import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import React from 'react';

import Explor from '../app/screens/Explor';
import Groups from '../app/screens/Groups';
import Profile from '../app/screens/Profile';
import Messages from '../app/screens/Messages';
import Travel from '../app/screens/Travel';

const Tab = createBottomTabNavigator();

const TabNavigator = () =>{
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarStyle: {backgroundColor: '#6E4B6B', height: 79, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden'},
            tabBarActiveTintColor: '#FFB703',
            tabBarInactiveTintColor: '#fff',
        }}>
          <Tab.Screen name="Explorer" component={Explor} options={{
            tabBarIcon:({color, size}) => (
                <Image 
                    source={require('../assets/planete-terre.png')}
                    style={{ tintColor: color, width: size * 1.2, height: size * 1.2 }}
                />
            )
          }} />
          <Tab.Screen name="Groupes" component={Groups} options={{
            tabBarIcon:({color, size}) => (
                <Image 
                    source={require('../assets/groupe.png')}
                    style={{ tintColor: color, width: size * 1.5, height: size * 1.2 }}
                />
            )
          }} />
          <Tab.Screen name="Voyages" component={Travel} options={{
            tabBarIcon:({color, size}) => (
                <Image 
                    source={require('../assets/logo-jolly-journey-coeur-blanc.png')}
                    style={{ tintColor: color, width: size * 1.2, height: size * 1.2 }}
                />
            )
          }} />
          <Tab.Screen name="Messages" component={Messages} options={{
            tabBarIcon:({color, size}) => (
                <Image 
                    source={require('../assets/un-message.png')}
                    style={{ tintColor: color, width: size * 1.2, height: size * 1.2 }}
                />
            )
          }} />
          <Tab.Screen name="Profil" component={Profile} options={{
            tabBarIcon:({color, size}) => (
                <Image 
                    source={require('../assets/profil.png')}
                    style={{ tintColor: color, width: size * 1.6, height: size * 1.2 }}
                />
            )
          }} />
        </Tab.Navigator>
      );
}

export default TabNavigator;