import {
  View,
  Image,
} from "react-native";
import React from "react";
import { IMAGES } from "../theme/theme";
import Btn from "../component/Btn";
import { homeStyles } from "../style/StyleHome";
import { styles } from "../style/Style";

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={homeStyles.container}>
        <View style={homeStyles.logoContainer}>
          <Image source={IMAGES.logo} style={homeStyles.logo} />
        </View>

        <View style={homeStyles.buttonContainer}>
          <Btn
            name="Connexion"
            action={() => navigation.navigate("SignIn")}
            textStyle={styles.buttonTextStyle}
            buttonStyle={styles.buttonStyle}
          />
          <Btn
            name="Inscription"
            action={() => navigation.navigate("SignUp")}
            textStyle={styles.buttonTextStyle}
            buttonStyle={styles.buttonStyle}
          />
        </View>
      </View>
    </View>
  );
};

export default Home;

