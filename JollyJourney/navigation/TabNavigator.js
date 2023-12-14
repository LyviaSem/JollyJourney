import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import React from 'react';

import Explorer from '../app/screens/Explorer';
import Groupes from '../app/screens/Groupes';
import Profil from '../app/screens/Profil';
import Messages from '../app/screens/Messages';
import Voyages from '../app/screens/Voyages';

const Tab = createBottomTabNavigator();

const TabNavigator = () =>{
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarStyle: {backgroundColor: '#6E4B6B', height: 79, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden'},
            tabBarActiveTintColor: '#FFB703',
            tabBarInactiveTintColor: '#fff',
        }}>
          <Tab.Screen name="Explorer" component={Explorer} options={{
            tabBarIcon:({color, size}) => (
                <Image 
                    source={require('../assets/icon_globe_.png')}
                    style={{ tintColor: color, width: size * 1.2, height: size * 1.2 }}
                />
            )
          }} />
          <Tab.Screen name="Groupes" component={Groupes} options={{
            tabBarIcon:({color, size}) => (
                <Image 
                    source={require('../assets/icon_group_.png')}
                    style={{ tintColor: color, width: size * 1.2, height: size * 1.2 }}
                />
            )
          }} />
          <Tab.Screen name="Voyages" component={Voyages} options={{
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
                    source={require('../assets/icon_chat_bubble_.png')}
                    style={{ tintColor: color, width: size * 1.2, height: size * 1.2 }}
                />
            )
          }} />
          <Tab.Screen name="Profil" component={Profil} options={{
            tabBarIcon:({color, size}) => (
                <Image 
                    source={require('../assets/icon_user_.png')}
                    style={{ tintColor: color, width: size * 1.2, height: size * 1.2 }}
                />
            )
          }} />
        </Tab.Navigator>
      );
}

export default TabNavigator;