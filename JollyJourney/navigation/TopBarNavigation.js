import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ApercuContent from '../app/screens/Travel/ApercuContent';
import ItineraireContent from '../app/screens/Travel/ItineraireContent';
import Expenses from '../app/screens/Travel/Expenses';




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
      <Tab.Screen name="Dépense" component={Expenses} initialParams={{trip: trip}}/>
    </Tab.Navigator>
  );
}

export default TopBarNavigation;