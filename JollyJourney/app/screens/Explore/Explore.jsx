import React, { useState, useEffect } from "react";
import {
  TextInput,
  StatusBar,
  ScrollView,
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getFirestore, collection, getDocs } from "@firebase/firestore";
import City from "../../component/City";
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchBar from "../../component/SearchBar";

function Explore({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState([]);

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
    <City picture={item.pic} name={item.name} onPressProps={{ routeName: "Cities", additionalProps: { name: item.name, description: item.description, picture: item.pic }}} />
  );

  return (
    <ScrollView
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,
      }}
      contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
    >

    <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} />

      <FlatList
        data={filteredLocations}
        keyExtractor={(item) => item.id}
        renderItem={renderCityItem}
      />
    </ScrollView>
  );
}

export default Explore;

