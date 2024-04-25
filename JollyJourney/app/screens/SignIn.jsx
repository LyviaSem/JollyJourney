import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useUser } from "../../context/UserContext";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { images } from "../theme/theme";

const SignIn = ({ navigation }) => {
  const { updateUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const getUserDetailsFromFirestore = async (uid) => {
    const db = getFirestore();
    const userDoc = doc(db, "users", uid);

    try {
      const userDocSnapshot = await getDoc(userDoc);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();

        // Mise à jour du contexte utilisateur avec les détails récupérés
        updateUser({
          uid: uid,
          pseudo: userData.pseudo || "",
          email: email,
          imageURL: userData.imageURL || "",
        });
      } else {
        console.log("Le document utilisateur n'existe pas dans Firestore.");
      }
    } catch (error) {
      console.log(
        "Erreur lors de la récupération des détails utilisateur depuis Firestore:",
        error
      );
    }
  };

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      await getUserDetailsFromFirestore(response.user.uid);
      alert("Bienvenue, " + email + " !");
    } catch (error) {
      console.log(error);
      alert("La connexion a échoué : " + error.message);
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
            source={images.logo}
            style={styles.logo}
          />
        </View>
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

        {loading ? (
          <ActivityIndicator size="large" color="#0000FF" />
        ) : (
          <>
            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={signIn}
            >
              <Text style={styles.buttonText}>Connexion</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.switchButtonText}>
            Pas encore inscrit ? S'inscrire
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignIn;

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
  input: {
    marginVertical: 4,
    height: 51,
    width: 340,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
});
