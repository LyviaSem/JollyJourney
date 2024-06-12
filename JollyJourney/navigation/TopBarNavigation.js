import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Overview from '../app/screens/Travel/Overview';
import Itinerary from '../app/screens/Travel/Itinerary';
import Expenses from '../app/screens/Travel/Expenses';
import { COLORS } from '../app/theme/theme';
import { textStyles } from '../app/style/textStyles';


const Tab = createMaterialTopTabNavigator();


function TopBarNavigation({route}) {
    const {trip} = route.params;
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle:{
          height:5,
          borderRadius:5,
          backgroundColor: COLORS.purple,
        },
        tabBarLabelStyle:{
          ...textStyles.subTitle
        }
      }}
    >
      <Tab.Screen
        name="Aperçu"
        component={Overview}
        initialParams={{ trip: trip }}
      />
      <Tab.Screen name="Itinéraire" component={Itinerary} initialParams={{trip: trip}}/>
      <Tab.Screen name="Dépense" component={Expenses} initialParams={{trip: trip}}/>
    </Tab.Navigator>
  );
}

export default TopBarNavigation;