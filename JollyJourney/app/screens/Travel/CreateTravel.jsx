import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Text,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Calendar } from "react-native-calendars";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
} from "@firebase/firestore";
import { images } from "../../theme/theme";
import PicModal from "../../component/PicModal";
import { uploadImage, removeImage } from "../../services/imageService";

const CreateTravel = ({ navigation: { goBack }, route }) => {
  const { groupTrips, groupId } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [nom, setNom] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [imageUri, setImageUri] = useState();


  const handleDayPress = (day) => {
    if (!selectedStartDate || selectedEndDate) {
      setSelectedStartDate(day.dateString);
      setSelectedEndDate("");
    } else {
      setSelectedEndDate(day.dateString);
    }
  };

  const handleSubmit = () => {
    if (!selectedStartDate || !selectedEndDate) {
      alert(
        "Erreur",
        "Veuillez sélectionner une date de début et une date de fin."
      );
      return;
    }

    if (!nom.trim()) {
      alert("Erreur", "Veuillez entrer le nom de la destination.");
      return;
    }

    const overlappingTrips = groupTrips.filter((trip) => {
      const tripStartDate = new Date(trip.dateDebut);
      const tripEndDate = new Date(trip.dateFin);
      const selectedStartDateObj = new Date(selectedStartDate);
      const selectedEndDateObj = new Date(selectedEndDate);

      return (
        (selectedStartDateObj >= tripStartDate &&
          selectedStartDateObj <= tripEndDate) ||
        (selectedEndDateObj >= tripStartDate &&
          selectedEndDateObj <= tripEndDate) ||
        (tripStartDate >= selectedStartDateObj &&
          tripEndDate <= selectedEndDateObj)
      );
    });

    if (overlappingTrips.length > 0) {
      alert(
        "Alerte Vous avez déjà un voyage prévu pour les dates sélectionnées. Veuillez modifier vos dates."
      );
      return;
    }

    creerVoyage(groupId, nom, selectedStartDate, selectedEndDate);
    setModalVisible(false);
    goBack();
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
        imageURL: imageUri || null,
      });

      const tripId = newTripRef.id;

      updateFirebase(newTripRef, tripId);

      alert("Voyage créé avec succès avec l'ID:", newTripRef.id);
    } catch (error) {
      console.error("Erreur lors de la création du voyage:", error);
      return null;
    }
  };

  const updateFirebase = async (docRef, id) => {
    await updateDoc(docRef, { id: id });
  };

  return (
    <View
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.groupInfo}>
            <TouchableOpacity
              style={styles.profilImageContainer}
              onPress={() => setModalVisible(true)}
            >
              <Image
                source={imageUri ? { uri: imageUri } : images.defaultProfile}
                style={styles.profilImage}
              />
            </TouchableOpacity>

            <TextInput
              style={{ paddingHorizontal: 10 }}
              placeholder="Destination"
              value={nom}
              onChangeText={(text) => setNom(text)}
            />
          </View>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={{
              [selectedStartDate]: {
                selected: true,
                startingDay: true,
                color: "green",
              },
              [selectedEndDate]: {
                selected: true,
                endingDay: true,
                color: "green",
              },
            }}
            minDate={new Date().toISOString().split("T")[0]}
            theme={{
              calendarBackground: "#FEF5EE",
              textSectionTitleColor: "black",
              selectedDayBackgroundColor: "#6E4B6B",
              selectedDayTextColor: "white",
              todayTextColor: "#FFB703",
              todayButtonFontWeight: "bold",
              dayTextColor: "black",
              textDisabledColor: "gray",
              arrowColor: "#6E4B6B",
              monthTextColor: "black",
              indicatorColor: "purple",
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
              onPress={() => goBack()}
            >
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <PicModal
        collection="trips"
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        uploadImage={uploadImage}
        removeImage={removeImage}
        imageUri={setImageUri}
      />
    </View>
  );
};

export default CreateTravel;

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
    marginBottom: 30,
  },
  input: {
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  card: {
    width: 344,
    height: 68,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginBottom: 30,
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
  arrowButton: {
    width: 50,
    height: 50,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  arrowImage: {
    width: 30,
    height: 30,
  },
  card: {
    width: 344,
    height: 68,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginBottom: 20,
    backgroundColor: "white",
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
  selectionButton: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  selectedIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#6E4B6B",
  },
  Button: {
    backgroundColor: "#6E4B6B",
    borderRadius: 15,
    width: 150,
    height: 70,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFB703",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainerError: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 80,
  },
  modalContentError: {
    backgroundColor: "rgba(0, 0, 0, 0.5);",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalErrorText: {
    color: "white",
    fontWeight: "bold",
  },
  modalInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  profilImage: {
    borderRadius: 75,
    width: 50,
    height: 50,
    borderColor: "black",
    borderWidth: 1,
  },
  groupInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    height: 70,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    width: 380,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
