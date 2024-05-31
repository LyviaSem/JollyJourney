import React from "react";
import { useUser } from "../../../context/UserContext";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  Platform,
  ActivityIndicator
} from "react-native";
import Cards from "../../component/Card/Cards";
import { images } from "../../theme/theme";

const Contacts = ({}) => {
  const { userGroups, loadingGroups } = useUser();

  if (loadingGroups) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderGroupItem = ({ item }) => (
    <Cards
      behaviorType="type2"
      name={item.info.name}
      image={item.info.imageURL ? { uri: item.info.imageURL } : images.defaultProfile} 
      onPressProps={{ routeName: "Message", additionalProps: { group: item } }}
    />
  );

  return (
    <View
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 20,
          marginTop: 91,
          alignSelf: "center",
        }}
      >
        Mes contacts
      </Text>
      <View style={{ alignItems: "center", marginTop: 30 }}>
        <FlatList
          data={userGroups}
          keyExtractor={(item) => item.info.id}
          renderItem={renderGroupItem}
        />
      </View>
    </View>
  );
};

export default Contacts;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    color: "#FFB703",
    marginTop: 10,
    fontSize: 40,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 50,
    flexDirection: "row",
  },
  logo: {
    width: 250,
    height: 150,
    resizeMode: "contain",
  },
  loginButton: {
    backgroundColor: "#6E4B6B",
    borderRadius: 15,
    width: 150,
    height: 70,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  registerButton: {
    backgroundColor: "#6E4B6B",
    borderRadius: 15,
    width: 150,
    height: 70,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  switchButton: {
    margin: 10,
    alignItems: "center",
  },
  switchButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFB703",
    fontWeight: "bold",
  },
});
