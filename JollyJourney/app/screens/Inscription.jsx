import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, StatusBar, Image} from 'react-native'
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import {createUserWithEmailAndPassword} from "firebase/auth"
//import { useNavigation } from '@react-navigation/native';

const Inscription = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;
    const [authMode, setAuthMode] = useState('login');
    //const navigation = useNavigation();

    const signUp = async () => {
        setLoading(true);
        try {
          const response = await createUserWithEmailAndPassword(auth, email, password);
          console.log(response);
          alert('Consultez vos mails !');
        } catch (error) {
          console.log(error);
          alert("L'inscription a échoué : " + error.message);
        } finally {
          setLoading(false);
        }
      };

  return (
    <View style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>

        <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo-jolly-journey.png')}
            style={styles.logo}
          />
        </View>

      <TextInput value={email} style={styles.input} placeholderTextColor="#6E4B6B" placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)} />
      <TextInput secureTextEntry={true} value={password} style={styles.input} placeholderTextColor="#6E4B6B" placeholder="Password" autoCapitalize="none" onChangeText={(text) => setPassword(text)} />
        <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={signUp}>
                <Text style={styles.buttonText}>Inscription</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.switchButton} onPress={() => navigation.navigate('Connexion')}>
        <Text style={styles.switchButtonText}>
          Déjà inscrit ? Se connecter
        </Text>
      </TouchableOpacity>
      </View>
    </View>
  )
}

export default Inscription;

const styles = StyleSheet.create({
    container: {
      marginHorizontal: 20,
      // flex: 1,
      justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 250,
        height: 150,
        resizeMode: 'contain',
    },
    input: {
        marginVertical: 4,
        height: 51,
        width: 340,
        // borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: "#fff",
        //placeholderTextColor: "#6E4B6B",
    },
    loginButton: {
      backgroundColor: '#6E4B6B',
      borderRadius: 4,
      width: 150,
      height: 50,
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    registerButton: {
      backgroundColor: '#6E4B6B',
      borderRadius: 4,
      width: 150,
      height: 50,
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    switchButton: {
      margin: 10,
      alignItems: 'center',
    },
    switchButtonText: {
      color: '#6E4B6B',
      fontSize: 16,
    },
    button: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: "#FFB703",
      fontWeight: 'bold',
    },
  });