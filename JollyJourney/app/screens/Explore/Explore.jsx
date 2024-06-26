import React, { useState, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  View,
} from "react-native";
import { getFirestore, collection, getDocs } from "@firebase/firestore";
import SearchBar from "../../component/SearchBar";
import Thumbnail from "../../component/thumbnail";
import { exploreStyle } from "../../style/exploreStyle";

function Explore() {
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

  renderCityItem = ({ item }) => (
    <Thumbnail
      picture={item.pic}
      name={item.name}
      onPressProps={{ routeName: "Cities", additionalProps: { city: item } }}
    />
  );

  return (
    <SafeAreaView style={exploreStyle.container}>
      <View style={exploreStyle.contentContainer}>
        <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} />

        <FlatList
          data={filteredLocations}
          keyExtractor={(item) => item.id}
          renderItem={renderCityItem}
        />
      </View>
    </SafeAreaView>
  );
}

export default Explore;
