import { View, Text, StatusBar, ImageBackground, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, {useState} from "react";
import ApercuContent from '../Travel/ApercuContent';
import ItineraireContent from '../Travel/ItineraireContent';
import DepenseContent from '../Travel/DepenseContent';

const GroupTrip = ({route}) => {

  const {id}  = route.params;

  const [selectedTab, setSelectedTab] = useState('Aperçu');

  const renderContent = () => {
    switch (selectedTab) {
      case 'Aperçu':
        return <ApercuContent />;
      case 'Itinéraire':
        return <ItineraireContent id={id} />;
      case 'Dépense':
        return <DepenseContent />;
      default:
        return null;
    }
  };
  const tabStyles = {
    Aperçu: {
      backgroundColor: selectedTab === 'Aperçu' ? '#6E4B6B' : '#dddddd',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderWidth: 1,
      borderColor: selectedTab === 'Aperçu' ? '#6E4B6B' : 'grey'
    },
    Itinéraire: {
      backgroundColor: selectedTab === 'Itinéraire' ? '#6E4B6B' : '#f0f0f0',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderWidth: 1,
      borderColor: selectedTab === 'Itinéraire' ? '#6E4B6B' : 'grey'
    },
    Dépense: {
      backgroundColor: selectedTab === 'Dépense' ? '#6E4B6B' : '#f0f0f0',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderWidth: 1,
      borderColor: selectedTab === 'Dépense' ? '#6E4B6B' : 'grey'
      
    },
  };

  const textStyles = {
    Aperçu: {
      color: selectedTab === 'Aperçu' ? 'white' : 'grey',
    },
    Itinéraire: {
      color: selectedTab === 'Itinéraire' ? 'white' : 'grey',
    },
    Dépense: {
      color: selectedTab === 'Dépense' ? 'white' : 'grey',
    },
  };

  return (
    <View style={{
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      backgroundColor: "#FEF5EE",
      flex: 1,
    }}>

      <ImageBackground
        source={require('../../../assets/image_default.jpg')}
        style={[styles.backgroundImage]}
      >
        <TouchableOpacity
        onPress={() => goBack()}
        //top 70 pour IOS
        style={{ top: 20, left: 20 }}
        >
        <Image
          source={require("../../../assets/avion-papier-retour.png")}
          style={[styles.backButton]}
        />
        </TouchableOpacity>
      </ImageBackground>

      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setSelectedTab('Aperçu')} style={[styles.tabButton, tabStyles['Aperçu']]}>
          <Text style={[styles.tabText, textStyles['Aperçu']]}>Aperçu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('Itinéraire')} style={[styles.tabButton, tabStyles['Itinéraire']]}>
          <Text style={[styles.tabText, textStyles['Itinéraire']]}>Itinéraire</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('Dépense')} style={[styles.tabButton, tabStyles['Dépense']]}>
          <Text style={[styles.tabText, textStyles['Dépense']]}>Dépense</Text>
        </TouchableOpacity>
      </View>
      <View>
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
    alignItems: 'center',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#6E4B6B',
    gap: -5
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
  backgroundImage: {
    width: 414,
    height: 189,
    marginBottom: 10
  },
  backButton: {
    width: 40,
    height: 34,
  },
});
