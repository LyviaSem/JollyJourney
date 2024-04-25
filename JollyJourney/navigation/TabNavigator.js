import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import React from 'react';

import Explore from '../app/screens/Explore/Explore';
import Groups from '../app/screens/Groups/Groups';
import Profile from '../app/screens/Profile';
import Contacts from '../app/screens/Chats/Contacts';
import Travel from '../app/screens/Travel/Travel';
import { images } from '../app/theme/theme';

const Tab = createBottomTabNavigator();

const TabNavigator = () =>{
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarStyle: {backgroundColor: '#6E4B6B', height: 79, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden'},
            tabBarActiveTintColor: '#FFB703',
            tabBarInactiveTintColor: '#fff',
        }}>
          <Tab.Screen name="Explorer" component={Explore} options={{
            tabBarIcon:({color, size}) => (
                <Image 
                    source={images.globe}
                    style={{ tintColor: color, width: size * 1.2, height: size * 1.2 }}
                />
            )
          }} />
          <Tab.Screen name="Groupes" component={Groups} options={{
            tabBarIcon:({color, size}) => (
                <Image 
                    source={images.group}
                    style={{ tintColor: color, width: size * 1.5, height: size * 1.2 }}
                />
            )
          }} />
          <Tab.Screen name="Voyages" component={Travel} options={{
            tabBarIcon:({color, size}) => (
                <Image 
                    source={images.travel}
                    style={{ tintColor: color, width: size * 1.2, height: size * 1.2 }}
                />
            )
          }} />
          <Tab.Screen name="Messages" component={Contacts} options={{
            tabBarIcon:({color, size}) => (
                <Image 
                    source={images.chat}
                    style={{ tintColor: color, width: size * 1.2, height: size * 1.2 }}
                />
            )
          }} />
          <Tab.Screen name="Profil" component={Profile} options={{
            tabBarIcon:({color, size}) => (
                <Image 
                    source={images.profil}
                    style={{ tintColor: color, width: size * 1.6, height: size * 1.2 }}
                />
            )
          }} />
        </Tab.Navigator>
      );
}

export default TabNavigator;