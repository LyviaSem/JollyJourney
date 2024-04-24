import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
} from "react-native";
import React from "react";

const Cities = ({ route, navigation: { goBack } }) => {
  const { name, description, picture } = route.params;

  return (
    <View
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,
      }}
    >
      <ImageBackground
        source={{ uri: picture }}
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
      <Text style={[styles.text]}>{name}</Text>
      <Text style={[styles.text]}>{description}</Text>
    </View>
  );
};

export default Cities;

const styles = StyleSheet.create({
  backgroundImage: {
    width: 414,
    height: 276,
  },
  backButton: {
    width: 40,
    height: 34,
  },
  text: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
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
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
