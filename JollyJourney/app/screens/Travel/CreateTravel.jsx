import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Calendar } from "react-native-calendars";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
} from "@firebase/firestore";
import { IMAGES } from "../../theme/theme";
import PicModal from "../../component/PicModal";
import { uploadImage, removeImage } from "../../services/imageService";
import Btn from "../../component/Btn";
import { createTravelStyle } from "../../style/createTravelStyle";

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

  const getMarkedDates = (start, end) => {
    const markedDates = {};
    if (start) {
      markedDates[start] = {
        selected: true,
        startingDay: true,
        color: "green",
        textColor: "white",
      };
      if (end) {
        markedDates[end] = {
          selected: true,
          endingDay: true,
          color: "green",
          textColor: "white",
        };

        let currentDate = new Date(start);
        const endDate = new Date(end);

        while (currentDate < endDate) {
          currentDate.setDate(currentDate.getDate() + 1);
          const dateString = currentDate.toISOString().split("T")[0];
          if (dateString !== end) {
            markedDates[dateString] = {
              selected: true,
              color: "green",
              textColor: "white",
            };
          }
        }
      }
    }
    return markedDates;
  };

  const handleSubmit = () => {
    if (!selectedStartDate || !selectedEndDate) {
      alert("Veuillez sélectionner une date de début et une date de fin.");
      return;
    }

    if (!nom.trim()) {
      alert("Veuillez entrer le nom de la destination.");
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
    } catch (error) {
      console.error("Erreur lors de la création du voyage:", error);
      return null;
    }
  };

  const updateFirebase = async (docRef, id) => {
    await updateDoc(docRef, { id: id });
  };

  return (
    <View style={createTravelStyle.container}>
      <View style={createTravelStyle.modalContainer}>
        <View style={createTravelStyle.modalContent}>
          <View style={createTravelStyle.groupInfo}>
            <TouchableOpacity
              style={createTravelStyle.profilImageContainer}
              onPress={() => setModalVisible(true)}
            >
              <Image
                source={imageUri ? { uri: imageUri } : IMAGES.defaultProfile}
                style={createTravelStyle.profilImage}
              />
            </TouchableOpacity>

            <TextInput
              style={createTravelStyle.textInput}
              placeholder="Destination"
              value={nom}
              onChangeText={(text) => setNom(text)}
            />
          </View>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={getMarkedDates(selectedStartDate, selectedEndDate)}
            minDate={new Date().toISOString().split("T")[0]}
            theme={{
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
          <View style={createTravelStyle.buttonContainer}>
            <Btn
              name="Annuler"
              action={() => goBack()}
              buttonStyle={createTravelStyle.btn}
            />
            <Btn
              name="Valider"
              action={handleSubmit}
              buttonStyle={createTravelStyle.btn}
            />
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
