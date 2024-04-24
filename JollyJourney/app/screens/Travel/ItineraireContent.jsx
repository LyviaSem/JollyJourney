import { View, Text, TextInput, Button } from "react-native";
import React, {useState, useEffect} from "react";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  where,
  query,
} from "@firebase/firestore";

const ItineraireContent = ({ id }) => {

  const [voyage, setVoyage] = useState(null);
  const [activites, setActivites] = useState([]);

  useEffect(() => {
    const fetchVoyage = async () => {
      const firestore = getFirestore();
      const getTrip = collection(firestore, "trips");
      const q = query(getTrip, where("id", "==", id));
      const voyageDoc = await getDocs(q);
      const voyageData = [];
      voyageDoc.forEach((doc) => {
        voyageData.push(doc.data());
      });
      setVoyage(voyageData);
    };
    fetchVoyage();
  }, []);

  const renderJours = () => {
    if (!voyage || voyage.length === 0) return null;
    const jours = [];
    voyage.forEach((jourData) => {
      const { dateDebut, dateFin } = jourData;
      let currentDate = new Date(dateDebut);
      while (currentDate <= new Date(dateFin)) {
        jours.push(currentDate);
        currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
      }
    });
    return jours.map((jour, index) => (
      <View key={index}>
        <Text>{jour.toDateString()}</Text>
        <TextInput
          placeholder="Ajouter une activité"
          onChangeText={(text) => handleActiviteChange(text, index)}
        />
      </View>
    ));
  };
  

  const handleActiviteChange = (text, index) => {
    const newActivites = [...activites];
    newActivites[index] = text;
    setActivites(newActivites);
  };

  const sauvegarderActivites = () => {
  };

  return (
    <View>
      <Text>Itinéraire du voyage :</Text>
      {renderJours()}
      <Button title="Sauvegarder les activités" onPress={sauvegarderActivites} />
    </View>
  );
};

export default ItineraireContent;