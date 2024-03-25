import { View, Text, StatusBar, ImageBackground, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, {useState} from "react";
import ApercuContent from './ApercuContent';
import ItineraireContent from './ItineraireContent';
import DepenseContent from './DepenseContent';

const GroupTrip = ({ navigation }) => {

  const [selectedTab, setSelectedTab] = useState('Aperçu');

  const renderContent = () => {
    switch (selectedTab) {
      case 'Aperçu':
        return <ApercuContent />;
      case 'Itinéraire':
        return <ItineraireContent />;
      case 'Dépense':
        return <DepenseContent />;
      default:
        return null;
    }
  };

  return (
    <View style={{
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      backgroundColor: "#FEF5EE",
      flex: 1,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 50 }}>
        <TouchableOpacity onPress={() => setSelectedTab('Aperçu')} style={{ padding: 10 }}>
          <Text style={{ color: selectedTab === 'Aperçu' ? 'blue' : 'black' }}>Aperçu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('Itinéraire')} style={{ padding: 10 }}>
          <Text style={{ color: selectedTab === 'Itinéraire' ? 'blue' : 'black' }}>Itinéraire</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('Dépense')} style={{ padding: 10 }}>
          <Text style={{ color: selectedTab === 'Dépense' ? 'blue' : 'black' }}>Dépense</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {renderContent()}
      </View>
    </View>
  );
};

export default GroupTrip;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#f0f0f0',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  selectedTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: 'blue',
  },
  tabText: {
    fontSize: 16,
    color: 'black',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
