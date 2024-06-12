import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH, firestore } from "../../FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useUser } from "../../context/UserContext";
import { collection, doc, setDoc } from "firebase/firestore";
import { IMAGES } from "../theme/theme";
import Btn from "../component/Btn";
import { signUpStyle } from "../style/signUpStyle";
import { style } from "../style/Style";
import { COLORS } from "../theme/theme";

const SignUp = ({ navigation }) => {
  const { updateUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userID = response.user.uid;

      const usersCollection = collection(firestore, "users");
      await setDoc(doc(usersCollection, userID), {
        uid: userID,
        pseudo: pseudo,
        email: email,
      });

      updateUser({
        uid: userID,
        pseudo: pseudo,
        email: email,
      });
    } catch (error) {
      alert("L'inscription a échoué : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={style.container}>
      <View style={signUpStyle.container}>
        <View style={style.logoContainer}>
          <Image source={IMAGES.logo} style={style.logo} />
        </View>

        <TextInput
          value={pseudo}
          style={style.input}
          placeholderTextColor={COLORS.purple}
          placeholder="Pseudo"
          autoCapitalize="none"
          onChangeText={(text) => setPseudo(text)}
        />
        <TextInput
          value={email}
          style={style.input}
          placeholderTextColor={COLORS.purple}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          secureTextEntry={true}
          value={password}
          style={style.input}
          placeholderTextColor={COLORS.purple}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
        />
        <Btn
          name="Inscription"
          action={signUp}
          buttonStyle={style.buttonStyle}
        />
        <TouchableOpacity
          style={style.switchButton}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={style.switchButtonText}>
            Déjà inscrit ? Se connecter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUp;