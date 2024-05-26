import React, { useState, useEffect } from "react";
import {
  StatusBar,
  ScrollView,
  FlatList,
  Platform,
  SafeAreaView,
  View
} from "react-native";
import { getFirestore, collection, getDocs } from "@firebase/firestore";
import City from "../../component/City";
import SearchBar from "../../component/SearchBar";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

function Explore({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState([]);
  const tabBarHeight = useBottomTabBarHeight();

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const firestore = getFirestore();
        const locationsSnapshot = await getDocs(
          collection(firestore, "cities")
        );
        const locationsData = locationsSnapshot.docs.map((doc) => doc.data());
        setLocations(locationsData);
      } catch (error) {
        console.error("Error fetching locations: ", error);
        throw error;
      }
    };
    fetchLocations();
  }, [searchQuery]);

  const filteredLocations = locations.filter((location) => {
    const city = location.name ?? "";
    const country = location.pays ?? "";
    return (
      city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  renderCityItem = ({item}) => (
    <City picture={item.pic} name={item.name} onPressProps={{ routeName: "Cities", additionalProps: { city: item }}} />
  );

  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,
      }}
    >

    <View
      style={{alignItems: "center", justifyContent: "center"}}
    >
      <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} />

      <FlatList
        data={filteredLocations}
        keyExtractor={(item) => item.id}
        renderItem={renderCityItem}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
      />
    </View>

    
    </SafeAreaView>
  );
}

export default Explore;

