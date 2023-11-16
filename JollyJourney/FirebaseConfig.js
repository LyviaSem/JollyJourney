// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBItoAJai-7egCzVcG1kPBNr59It0bHajo",
  authDomain: "jolly-journey-680ea.firebaseapp.com",
  projectId: "jolly-journey-680ea",
  storageBucket: "jolly-journey-680ea.appspot.com",
  messagingSenderId: "204091247098",
  appId: "1:204091247098:web:936c6c43500b6731783c43"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);