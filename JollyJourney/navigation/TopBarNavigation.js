import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ApercuContent from '../app/screens/Travel/ApercuContent';
import ItineraireContent from '../app/screens/Travel/ItineraireContent';
import DepenseContent from '../app/screens/Travel/DepenseContent';
import { Platform, StatusBar } from 'react-native';


const Tab = createMaterialTopTabNavigator();


function TopBarNavigation({route}) {
    const {trip} = route.params;
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Aperçu"
        component={ApercuContent}
        initialParams={{ trip: trip }}
      />
      <Tab.Screen name="Itinéraire" component={ItineraireContent} initialParams={{trip: trip}}/>
      <Tab.Screen name="Dépense" component={DepenseContent} initialParams={{trip: trip}}/>
    </Tab.Navigator>
  );
}

export default TopBarNavigation;