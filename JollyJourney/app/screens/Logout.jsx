import { View, Text, Button, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

// type RouterProps{
//     navigation: NavigationProp<any,any>;
// }

const Logout = () => {
  return (
    <View style={{
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      backgroundColor: "#FEF5EE",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}>
      {/* <Button style={styles.logoutButton} onPress={() => FIREBASE_AUTH.signOut()} title='Logout'/> */}
      <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={() => FIREBASE_AUTH.signOut()}>
                <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Logout;

const styles = StyleSheet.create({

  container: {
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    color: '#FFB703',
    marginTop: 10,
    fontSize: 40,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 50,
    flexDirection: 'row', // Aligner les boutons horizontalement
  },
  logo: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
  },
  logoutButton: {
    backgroundColor: '#6E4B6B',
    borderRadius: 15,
    width: 150,
    height: 70,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#6E4B6B',
    borderRadius: 15,
    width: 150,
    height: 70,
    margin: 10,
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
    color: '#FFB703',
    fontWeight: 'bold',
  },
  input: {
    marginVertical: 4,
    height: 51,
    width: 340,
    // borderWidth: 1,
    // borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff"
}
});