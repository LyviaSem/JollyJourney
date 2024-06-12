import { View, Text, StatusBar, ImageBackground, TouchableOpacity, Image, StyleSheet, Platform, ScrollView, Animated } from "react-native";
import React, {useState, useRef, useEffect} from "react";
import ApercuContent from './ApercuContent';
import ItineraireContent from './ItineraireContent';
import DepenseContent from './DepenseContent';
import { IMAGES } from "../../theme/theme";
import { firestore } from "../../../FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const Trip = ({route, navigation: { goBack } }) => {

  const { trip }  = route.params;

  const [selectedTab, setSelectedTab] = useState('Aperçu');
  const [showOptions, setShowOptions] = useState(false);
  const [overviewElements, setOverviewElements] = useState([]);
  const [itineraryElements, setItineraryElements] = useState([]);
  const [loading, setLoading] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const overviewCollection = collection(firestore, 'trips', trip.id, 'overview');
        const overviewSnapshot = await getDocs(overviewCollection);

        if (!overviewSnapshot.empty) {
          const overviewData = [];
          overviewSnapshot.forEach((doc) => {
            overviewData.push(doc.data());
          });
          setOverviewElements(overviewData);
        }

        const itineraryCollection = collection(firestore, 'trips', trip.id, 'itinerary');
        const itinerarySnapshot = await getDocs(itineraryCollection);
        let itineraryData = [];
        if (!itinerarySnapshot.empty) {
          itineraryData = itinerarySnapshot.docs.map(doc => doc.data());
        }
    
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false)
      }
    }
    fetchData();
  }, [trip.id]);

  const renderContent = () => {
    switch (selectedTab) {
      case 'Aperçu':
        return <ApercuContent 
          trip={trip}
          showOptions={showOptions}
          toggleOptions={toggleOptions}
          overview={overviewElements}
        />;
      case 'Itinéraire':
        return <ItineraireContent 
          trip={trip} 
          itinerary={itineraryElements} 
        />;
      case 'Dépense':
        return <DepenseContent />;
      default:
        return null;
    }
  };


  const toggleOptions = () => {
    setShowOptions(!showOptions);
    Animated.timing(spinValue, {
      toValue: showOptions ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      backgroundColor: "#FEF5EE",
      flex: 1,
    }}>

      <ImageBackground
        source={trip.imageURL? { uri: trip.imageURL } : IMAGES.defaultImage}
        style={[styles.backgroundImage]}
      >
        <TouchableOpacity
        onPress={() => goBack()}
        style={{ top: 20, left: 20 }}
        >
        <Image
          source={IMAGES.planeBtn}
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
      <ScrollView>
        {renderContent()}
      </ScrollView>
      {selectedTab === 'Aperçu' && (
  <>
    <TouchableOpacity style={styles.addButton} onPress={toggleOptions}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Icon name={"plus"} size={24} color="white" />
      </Animated.View>
    </TouchableOpacity>
  </>
)}
    </View>
  );
};

export default Trip;

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
  addButton: {
    backgroundColor: '#6E4B6B',
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 5,
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 150,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  optionText: {
    color: 'black',
    fontSize: 16,
  },
});
