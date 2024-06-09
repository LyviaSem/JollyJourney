import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { FIREBASE_AUTH, firestore } from "../../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useUser } from "../../context/UserContext";
import { doc, getDoc } from "firebase/firestore";
import { IMAGES, COLORS } from "../theme/theme";
import { signInStyle } from "../style/StyleSignIn";
import { styles } from "../style/Style";
import Btn from "../component/Btn";

const SignIn = ({ navigation }) => {
  const { updateUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const auth = FIREBASE_AUTH;

  const getUserDetailsFromFirestore = async (uid) => {
    const userDoc = doc(firestore, "users", uid);

    try {
      const userDocSnapshot = await getDoc(userDoc);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();

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
    } catch (error) {
      setError("La connexion a échoué : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={signInStyle.logoContainer}>
        <Image source={IMAGES.logo} style={signInStyle.logo} />
      </View>
      <TextInput
        value={email}
        style={signInStyle.input}
        placeholderTextColor={COLORS.purple}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        secureTextEntry={true}
        value={password}
        style={signInStyle.input}
        placeholderTextColor={COLORS.purple}
        placeholder="Password"
        autoCapitalize="none"
        onChangeText={(text) => setPassword(text)}
      />

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.purple} />
      ) : (
        <Btn
          name="Connexion"
          action={signIn}
          textStyle={styles.buttonTextStyle}
          buttonStyle={styles.buttonStyle}
        />
      )}

      <View style={signInStyle.errorContainer}>
        {error ? <Text style={signInStyle.errorText}>{error}</Text> : null}
      </View>

      <TouchableOpacity
        style={signInStyle.switchButton}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={signInStyle.switchButtonText}>
          Pas encore inscrit ? S'inscrire
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignIn;
