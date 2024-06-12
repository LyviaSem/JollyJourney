import {
  View,
  Image,
} from "react-native";
import React from "react";
import { IMAGES } from "../theme/theme";
import Btn from "../component/Btn";
import { homeStyles } from "../style/StyleHome";
import { style } from "../style/Style";

const Home = ({ navigation }) => {
  return (
    <View style={style.container}>
      <View style={homeStyles.container}>
        <View style={style.logoContainer}>
          <Image source={IMAGES.logo} style={style.logo} />
        </View>

        <View style={homeStyles.buttonContainer}>
          <Btn
            name="Connexion"
            action={() => navigation.navigate("SignIn")}
            buttonStyle={style.buttonStyle}
          />
          <Btn
            name="Inscription"
            action={() => navigation.navigate("SignUp")}
            buttonStyle={style.buttonStyle}
          />
        </View>
      </View>
    </View>
  );
};

export default Home;

