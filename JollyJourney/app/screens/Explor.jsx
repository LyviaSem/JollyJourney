import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StatusBar,
  Text,
  ScrollView,
  ImageBackground,
} from "react-native";
import { getFirestore, collection, getDocs } from "@firebase/firestore";
import { TouchableOpacity } from "react-native";

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

  return (
    <ScrollView
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,
      }}
      contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
    >
      <TextInput
        placeholder="search"
        clearButtonMode="always"
        style={{
          color: "#000000",
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 28.5,
          marginTop: 49,
          marginBottom: 20,
          backgroundColor: "#C4C4C4",
          opacity: 0.22,
          width: 344,
        }}
        value={searchQuery}
        onChangeText={(query) => handleSearch(query)}
      />
      {filteredLocations.map((location) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Cities", {
              picture: location.pic,
              name: location.name,
              description: location.description,
            })
          }
        >
          <View
            key={location.id}
            style={{
              overflow: "hidden",
              width: 344,
              height: 165,
              marginBottom: 30,
            }}
          >
            <ImageBackground
              source={{ uri: location.pic }}
              imageStyle={{ borderRadius: 10 }}
              style={{
                resizeMode: "cover",
                overflow: "hidden",
                flex: 1,
                width: "100%",
                height: "100%",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  backgroundColor: "#FFFF",
                  opacity: 0.85,
                  width: 144,
                  height: 38,
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottomLeftRadius: 10,
                }}
              >
                <Text style={{ color: "#6E4B6B", fontSize: 12 }}>
                  {location.name}
                </Text>
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

export default Explore;
