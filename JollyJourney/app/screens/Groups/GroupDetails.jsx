import { View, StatusBar, TouchableOpacity, Image, ImageBackground, StyleSheet, Modal, Button, TextInput, FlatList, Text, ScrollView } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  where,
  query,
} from "@firebase/firestore";
import Cards from '../../component/Card/Cards';
import { images } from '../../theme/theme';
import { firestore } from '../../../FirebaseConfig';


const GroupDetails = ({ route, navigation }) => {

  const { group } = route.params;
  console.log(group)

  const [groupTrips, setGroupTrips] = useState([]);

  const getVoyagesGroupe = async (groupId) => {
    try {
        const trips = collection(firestore, "trips");
        const q = query(trips, where("groupId", "==", groupId));
        const tripsDoc = await getDocs(q);

        const tripData = [];
        tripsDoc.forEach((doc) => {
            tripData.push(doc.data());
        });

        setGroupTrips(tripData);
    } catch (error) {
        console.error('Erreur lors de la récupération des voyages du groupe:', error);
    }
};

useFocusEffect(
  useCallback(() => {
    getVoyagesGroupe(group.id);
  }, [group.id])
);

  const renderTripsItem = ({ item }) => (
   <Cards behaviorType="type2" name={item.nom} image={item.imageURL? { uri: item.imageURL } : images.defaultProfile} onPressProps={{ routeName: "GroupTrip", additionalProps: { trip: item }}}/>
  );

  //if(loading){
    return (
        <View
          style={{
              paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
              backgroundColor: "#FEF5EE",
              flex: 1,
          }}
        >

          <View>
            <ImageBackground
            source={group.imageURL? { uri: group.imageURL } : images.defaultImage}
            style={[styles.backgroundImage]}
            >
                <TouchableOpacity
                onPress={() => navigation.navigate('Groups')}
                //top 70 pour IOS
                style={{ top: 20, left: 20 }}
                >
                <Image
                    source={images.planeBtn}
                    style={[styles.backButton]}
                />
                </TouchableOpacity>
            </ImageBackground>

            <View style={{ position: 'absolute', top: 10, right: 10, padding: 10 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('CreateTravel', {groupTrips: groupTrips, id: group.id})}
              >
                <Image
                  source={images.plusIcon}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
            
            </View>

            {groupTrips.length > 0 ? (
              <ScrollView contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}>
                <FlatList
                  data={groupTrips}
                  keyExtractor={(item) => item.id}
                  renderItem={renderTripsItem}
                />
              </ScrollView>
            ) : (
              <View>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 91, alignSelf: 'center' }}>Pas encore de voyage pour ce groupe</Text>
        <View style={{ alignItems: "center", }}>
          <TouchableOpacity
            style={[styles.button, styles.Button]}
            onPress={() => navigation.navigate('CreateTravel', {groupTrips: groupTrips, id: group.id})}
          >
            <Text style={styles.buttonText}>Créer le premier voyage</Text>
          </TouchableOpacity>
        </View>
      </View>
      

      )}
          </View>
        </View>
    )
  //}
}

export default GroupDetails;

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#6E4B6B",
    borderRadius: 15,
    width: 100,
    height: 50,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  backButton: {
      width: 40,
      height: 34,
  },
  backgroundImage: {
      width: 414,
      height: 189,
    marginBottom: 30
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    //backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  card: {
    width: 344,
    height: 68,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 30,
    backgroundColor: 'white',
  },
  profileImage: {
  width: 35,
  height: 35,
  borderRadius: 10,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
  },
  Button: {
    backgroundColor: "#6E4B6B",
    borderRadius: 15,
    width: 190,
    height: 57,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
})