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
import Cards from '../../component/Card/Cards';
import ProfilIcon from "../../../assets/utilisateur.png";

const GroupDetails = ({ route, navigation: { goBack } , navigation}) => {

  const { id } = route.params;

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

    const overlappingTrips = groupTrips.filter(trip => {
      const tripStartDate = new Date(trip.dateDebut);
      const tripEndDate = new Date(trip.dateFin);
      const selectedStartDateObj = new Date(selectedStartDate);
      const selectedEndDateObj = new Date(selectedEndDate);
  
      return (
        (selectedStartDateObj >= tripStartDate && selectedStartDateObj <= tripEndDate) ||
        (selectedEndDateObj >= tripStartDate && selectedEndDateObj <= tripEndDate) ||
        (tripStartDate >= selectedStartDateObj && tripEndDate <= selectedEndDateObj)
      );
    });
  
    if (overlappingTrips.length > 0) {
      alert('Alerte Vous avez déjà un voyage prévu pour les dates sélectionnées. Veuillez modifier vos dates.');
      return;
    }

    creerVoyage(id, nom, selectedStartDate, selectedEndDate)
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
        dateFin: dateFin,
      });

      const tripId = newTripRef.id;

      updateFirebase(newTripRef, tripId)

      alert('Voyage créé avec succès avec l\'ID:', newTripRef.id);
    } catch (error) {
      console.error('Erreur lors de la création du voyage:', error);
      return null;
    }
  };

  const updateFirebase = async (docRef, id) => {
    await updateDoc(docRef, { id: id });
  }

  const getVoyagesGroupe = async (groupId) => {
    try {
        const firestore = getFirestore();
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

  useEffect(() => {
    getVoyagesGroupe(id)
  }, [id]);

  const renderTripsItem = ({ item }) => (
   <Cards behaviorType="type2" name={item.nom} image={ProfilIcon} onPressProps={{ routeName: "GroupTrip", additionalProps: { id: item.id}}}/>
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
            source={require('../../../assets/image_default.jpg')}
            style={[styles.backgroundImage]}
            >
                <TouchableOpacity
                onPress={() => goBack()}
                //top 70 pour IOS
                style={{ top: 20, left: 20 }}
                >
                <Image
                    source={require("../../../assets/avion-papier-retour.png")}
                    style={[styles.backButton]}
                />
                </TouchableOpacity>
            </ImageBackground>

            <View style={{ position: 'absolute', top: 10, right: 10, padding: 10 }}>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
              >
                <Image
                  source={require('../../../assets/plus.png')}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
            
            </View>

              <ScrollView contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}>
                <FlatList
                  data={groupTrips}
                  keyExtractor={(item) => item.id}
                  renderItem={renderTripsItem}
                />
              </ScrollView>

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
                      minDate={new Date().toISOString().split('T')[0]}
                      theme={{
                        calendarBackground: 'white',
                        textSectionTitleColor: 'black',
                        selectedDayBackgroundColor: '#6E4B6B',
                        selectedDayTextColor: 'white',
                        todayTextColor: '#FFB703',
                        todayButtonFontWeight: 'bold',
                        dayTextColor: 'black',
                        textDisabledColor: 'gray',
                        arrowColor: '#6E4B6B',
                        monthTextColor: 'black',
                        indicatorColor: 'purple',
                      }}
                    />
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={[styles.button, styles.loginButton]}
                        onPress={handleSubmit}
                      >
                        <Text style={styles.buttonText}>Valider</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.button, styles.loginButton]}
                        onPress={() => setModalVisible(false)}
                      >
                        <Text style={styles.buttonText}>Annuler</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
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
})