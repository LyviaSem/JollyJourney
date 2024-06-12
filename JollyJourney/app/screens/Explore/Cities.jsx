import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  Platform
} from "react-native";
import React from "react";
import { IMAGES } from "../../theme/theme";
import { citiesStyle } from "../../style/citiesStyle";
import { textStyles } from "../../style/textStyles";

const Cities = ({ route, navigation: { goBack } }) => {
  const { city } = route.params;

  return (
    <View
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,
      }}
    >
      <ImageBackground
        source={{ uri: city.pic }}
        style={[citiesStyle.backgroundImage]}
      >
        <TouchableOpacity
          onPress={() => goBack()}
          //top 70 pour IOS
          style={citiesStyle.backButtonContainer}
        >
          <Image
            source={IMAGES.planeBtn}
            style={[citiesStyle.backButton]}
          />
        </TouchableOpacity>
      </ImageBackground>
      <Text style={[citiesStyle.text, citiesStyle.title]}>{city.name}</Text>
      <Text style={[citiesStyle.text]}>{city.description}</Text>
    </View>
  );
};

export default Cities;
