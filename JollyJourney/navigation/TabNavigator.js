import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import React from 'react';

import Explore from '../app/screens/Explore/Explore';
import Groups from '../app/screens/Groups/Groups';
import Profile from '../app/screens/Profile';
import Contacts from '../app/screens/Chats/Contacts';
import Travels from '../app/screens/Travel/Travels';
import Cities from '../app/screens/Explore/Cities';
import GroupSelectMembers from '../app/screens/Groups/GroupSelectMembers';
import GroupTrips from '../app/screens/Groups/GroupTrips';
import GroupInfo from '../app/screens/Groups/GroupInfo';
import GroupDetails from '../app/screens/Groups/GroupDetails';
import TopBarNavigation from './TopBarNavigation';
import { IMAGES } from '../app/theme/theme';

function ApercuHeader() {
  return (
    <Image
      style= {{width: '100%',
        height: 189,}}
      source={IMAGES.defaultImage}
    />
  );
}



const Tab = createBottomTabNavigator();

const ExploreStack = createNativeStackNavigator();
const GroupsStack = createNativeStackNavigator();
const TravelStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();


function ExploreStackScreen() {
  return (
    <ExploreStack.Navigator>
      <ExploreStack.Screen name="Explore" component={Explore} options={{ headerShown: false }} />
      <ExploreStack.Screen name="Cities" component={Cities} options={{ headerShown: false }} />
    </ExploreStack.Navigator>
  );
}

function GroupsStackScreen() {
  return (
    <GroupsStack.Navigator>
      <GroupsStack.Screen name="Groups" component={Groups} options={{ headerShown: false }} />
      <GroupsStack.Screen name="GroupSelectMembers" component={GroupSelectMembers} options={{ headerShown: false }} />
      <GroupsStack.Screen name="GroupInfo" component={GroupInfo} options={{ headerShown: false }} />
      <GroupsStack.Screen name="GroupTrips" component={GroupTrips} options={{ headerShown: false }} />
      <GroupsStack.Screen
        name="Trip"
        component={TopBarNavigation}
        options={{ headerBackground: (props) => <ApercuHeader {...props} />, headerTitle: '' }}
      />
    </GroupsStack.Navigator>
  );
}

function TravelStackScreen() {
  return (
    <TravelStack.Navigator>
      <TravelStack.Screen name="Travels" component={Travels} options={{ headerShown: false }} />
      <TravelStack.Screen
        name="Trip"
        component={TopBarNavigation}
        options={{ headerBackground: (props) => <ApercuHeader {...props} />, headerTitle: '' }}
      />
    </TravelStack.Navigator>
  );
}

function ChatStackScreen() {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen name="Contacts" component={Contacts} options={{ headerShown: false }} />
      <ChatStack.Screen name="GroupsDetails" component={GroupDetails} options={{ headerShown: false }} />
    </ChatStack.Navigator>
  );
}

const TabNavigator = () =>{
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarStyle: {backgroundColor: '#6E4B6B', height: 79, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden'},
            tabBarActiveTintColor: '#FFB703',
            tabBarInactiveTintColor: '#fff',
        }}>
          <Tab.Screen name="Explorer" component={ExploreStackScreen} options={{
            tabBarIcon:({color, size}) => (
                <Image 
                    source={IMAGES.globe}
                    style={{ tintColor: color, width: size * 1.2, height: size * 1.2 }}
                />
            )
          }} />
          <Tab.Screen name="Groupes" component={GroupsStackScreen} options={{
            tabBarIcon:({color, size}) => (

              // <Icon name={"account-group-outline"} size={30} color="white"  />
                <Image 
                    source={IMAGES.group}
                    style={{ tintColor: color, width: size * 1.5, height: size * 1.2 }}
                />
            )
          }} />
          <Tab.Screen name="Voyages" component={TravelStackScreen} options={{
            tabBarIcon:({color, size}) => (
                <Image 
                    source={IMAGES.travel}
                    style={{ tintColor: color, width: size * 1.2, height: size * 1.2 }}
                />
            )
          }} />
          <Tab.Screen name="Messages" component={ChatStackScreen} options={{
            tabBarIcon:({color, size}) => (
                <Image 
                    source={IMAGES.chat}
                    style={{ tintColor: color, width: size * 1.2, height: size * 1.2 }}
                />
            )
          }} />
          <Tab.Screen name="Profil" component={Profile} options={{
            tabBarIcon:({color, size}) => (
                <Image 
                    source={IMAGES.profil}
                    style={{ tintColor: color, width: size * 1.6, height: size * 1.2 }}
                />
            )
          }} />
        </Tab.Navigator>
      );
}

export default TabNavigator;