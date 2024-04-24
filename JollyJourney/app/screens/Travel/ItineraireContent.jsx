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

const ItineraireContent = ({ route }) => {

  const {id} = route.params;

  console.log(id)

  const [voyage, setVoyage] = useState(null);
  const [activites, setActivites] = useState([]);

  useEffect(() => {
    // Récupérer les informations du voyage depuis Firestore
    const fetchVoyage = async () => {
      const firestore = getFirestore();
      const getTrip = collection(firestore, "trips");
      const q = query(trips, where(""))
      const voyageRef = firestore().collection('voyages').doc('ID_DU_VOYAGE');
      const voyageDoc = await voyageRef.get();
      if (voyageDoc.exists) {
        setVoyage(voyageDoc.data());
      }
    };
    fetchVoyage();
  }, []);

  const renderJours = () => {
    if (!voyage) return null;
    const { dateDebut, dateFin } = voyage;
    const jours = [];
    let currentDate = new Date(dateDebut);

    while (currentDate <= new Date(dateFin)) {
      jours.push(currentDate);
      currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }

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
    // Sauvegarder les activités dans Firestore
    // Vous pouvez utiliser activites et les associer au jour correspondant dans la base de données
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