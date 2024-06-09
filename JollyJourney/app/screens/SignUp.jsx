import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH, firestore } from "../../FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useUser } from "../../context/UserContext";
import { collection, doc, setDoc } from "firebase/firestore";
import { IMAGES } from "../theme/theme";
import Btn from "../component/Btn";
import { signInStyle } from "../style/StyleSignIn";

const Inscription = ({ navigation }) => {
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
    <View
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={IMAGES.logo}
            style={styles.logo}
          />
        </View>

        <TextInput
          value={pseudo}
          style={styles.input}
          placeholderTextColor="#6E4B6B"
          placeholder="Pseudo"
          autoCapitalize="none"
          onChangeText={(text) => setPseudo(text)}
        />
        <TextInput
          value={email}
          style={styles.input}
          placeholderTextColor="#6E4B6B"
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholderTextColor="#6E4B6B"
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
        />
        <Btn
            name="Inscription"
            action={signUp}
            textStyle={signInStyle.buttonTextStyle}
           buttonStyle={signInStyle.buttonStyle}
        />
        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.switchButtonText}>
            Déjà inscrit ? Se connecter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Inscription;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 150,
    resizeMode: "contain",
  },
  input: {
    marginVertical: 4,
    height: 51,
    width: 340,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  loginButton: {
    backgroundColor: "#6E4B6B",
    borderRadius: 4,
    width: 150,
    height: 50,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  registerButton: {
    backgroundColor: "#6E4B6B",
    borderRadius: 4,
    width: 150,
    height: 50,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  switchButton: {
    margin: 10,
    alignItems: "center",
  },
  switchButtonText: {
    color: "#6E4B6B",
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
