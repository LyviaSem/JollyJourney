import { View, StatusBar, TouchableOpacity, Image, ImageBackground, StyleSheet, Modal, Button, TextInput, FlatList, Text, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  where,
  query,
} from "@firebase/firestore";

const GroupDetails = ({ route, navigation: { goBack } , navigation}) => {

  const { id } = route.params;

  //console.log(route.params)

  const [modalVisible, setModalVisible] = useState(false);
  const [nom, setNom] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [groupTrips, setGroupTrips] = useState([]);

  useEffect(() => {
    if (!modalVisible) {
      setSelectedStartDate('');
      setSelectedEndDate('');
      setNom('');
    }
  }, [modalVisible]);

  const handleDayPress = (day) => {
    if (!selectedStartDate || selectedEndDate) {
      setSelectedStartDate(day.dateString);
      setSelectedEndDate('');
    } else {
      setSelectedEndDate(day.dateString);
    }
  };

  const handleSubmit = () => {
    if (!selectedStartDate || !selectedEndDate) {
      alert('Erreur', 'Veuillez sélectionner une date de début et une date de fin.');
      return;
    }

    if (!nom.trim()) {
      alert('Erreur', 'Veuillez entrer le nom de la destination.');
      return;
    }

    creerVoyage(id, nom, selectedStartDate, selectedEndDate)

    console.log('Date de début:', selectedStartDate);
    console.log('Date de fin:', selectedEndDate);
    setModalVisible(false);
    getVoyagesGroupe(id);
  };

  const creerVoyage = async (groupId, nom, dateDebut, dateFin) => {
    try {
      const firestore = getFirestore();
      const tripsCollection = collection(firestore, "trips");
      const newTripRef = await addDoc(tripsCollection, {
        groupId: groupId,
        nom: nom,
        dateDebut: dateDebut,
        dateFin: dateFin
      });

      const tripId = newTripRef.id;

      await updateDoc(newTripRef, { id: tripId });
  
      console.log('Voyage créé avec succès avec l\'ID:', newTripRef.id);
      //return newTripRef.id; // Retourner l'ID du nouveau voyage créé
    } catch (error) {
      console.error('Erreur lors de la création du voyage:', error);
      return null;
    }
  };

  const getVoyagesGroupe = async (groupId) => {
    try {
        // Récupérer tous les voyages du groupe spécifié
        const firestore = getFirestore();
        const trips = collection(firestore, "trips");
        const q = query(trips, where("groupId", "==", groupId));
        const tripsDoc = await getDocs(q);

        const tripData = [];
        tripsDoc.forEach((doc) => {
            tripData.push(doc.data());
        });

        //console.log(tripData)

        setGroupTrips(tripData);
        //setLoading(false);
    } catch (error) {
        console.error('Erreur lors de la récupération des voyages du groupe:', error);
        //setLoading(false);
    }
};

  useEffect(() => {
    getVoyagesGroupe(id)
  }, [id]);

 console.log(groupTrips)
  const updateGroups = async () => {
    getVoyagesGroupe
  };

  const renderTripsItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("GroupTrip")}
    >
      <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../../assets/utilisateur.png')}
                style={styles.profileImage}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.nom}</Text>
              </View>
            </View>
            <TouchableOpacity
            onPress={() => navigation.navigate("GroupTrip")}
            >
          <Image
            source={require("../../assets/avion-papier-retour.png")}
            style={[styles.backButton]}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
            source={require('../../assets/image_default.jpg')}
            style={[styles.backgroundImage]}
            >
                <TouchableOpacity
                onPress={() => goBack()}
                //top 70 pour IOS
                style={{ top: 20, left: 20 }}
                >
                <Image
                    source={require("../../assets/avion-papier-retour.png")}
                    style={[styles.backButton]}
                />
                </TouchableOpacity>
            </ImageBackground>

            <View style={{ position: 'absolute', top: 10, right: 10, padding: 10 }}>
              <TouchableOpacity
                onPress={() => setModalVisible(true)/*navigation.navigate("CreateTravel")*/}
              >
                <Image
                  source={require('../../assets/plus.png')}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>

              <View style={{ alignItems: 'center', marginTop: '50%' }}>
                <FlatList
                  data={groupTrips}
                  keyExtractor={(item) => item.id}
                  renderItem={renderTripsItem}
                />
              </View>

              <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <TextInput
                      style={styles.input}
                      placeholder="Nom de la destination"
                      value={nom}
                      onChangeText={setNom}
                    />
                    <Calendar
                      onDayPress={handleDayPress}
                      markedDates={{
                        [selectedStartDate]: { selected: true, startingDay: true, color: 'green' },
                        [selectedEndDate]: { selected: true, endingDay: true, color: 'green' },
                      }}
                      minDate={new Date().toISOString().split('T')[0]} // Empêcher la sélection de dates passées
                    />
                    <View style={styles.buttonContainer}>
                      <Button title="Valider" onPress={handleSubmit} />
                      <Button title="Annuler" onPress={() => setModalVisible(false)} />
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
        </View>
    )
  //}
}

export default GroupDetails;

const styles = StyleSheet.create({
  backButton: {
      width: 40,
      height: 34,
  },
  backgroundImage: {
      width: 414,
      height: 189,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    backgroundColor: '#fff',
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
    justifyContent: 'space-between', // Pour espacer les éléments à l'intérieur
    alignItems: 'center',
    padding: 10,
    marginBottom: 30,
    backgroundColor: 'white',
  },
  profileImage: {
  width: 35, // Modification de la largeur
  height: 35, // Modification de la hauteur
  borderRadius: 10, // Ajout de la bordure pour garder une forme arrondie
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
  },
})