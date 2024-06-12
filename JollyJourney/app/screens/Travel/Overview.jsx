import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { firestore } from "../../../FirebaseConfig";
import {
  collection,
  setDoc,
  getDocs,
  where,
  updateDoc,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import TodoList from "../../component/TodoList";
import Input from "../../component/Input";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RenderOptions from "../../component/RenderOptions";
import { COLORS } from "../../theme/theme";
import { textStyles } from "../../style/textStyles";
import { overviewStyles } from "../../style/overviewStyle";

const Overview = ({ route }) => {
  const { trip } = route.params;
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [overviewElements, setOverviewElements] = useState([]);
  const spinValue = useRef(new Animated.Value(0)).current;

  const addOptions = [
    { id: "1", name: "nouvel Input", action: () => addElemement("input") },
    { id: "2", name: "nouvelle Todo list", action: () => addElemement("todo") },
  ];

  const defaultInputs = [
    { type: "input", label: "Logement", value: "" },
    { type: "input", label: "Moyen de locomotion", value: "" },
    { type: "input", label: "Prix du moyen de locomotion", value: "" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const overviewCollection = collection(
          firestore,
          "trips",
          trip.id,
          "overview"
        );
        const overviewSnapshot = await getDocs(overviewCollection);

        if (overviewSnapshot.empty) {
          await addData();
        } else {
          const overviewData = [];
          overviewSnapshot.forEach((doc) => {
            overviewData.push(doc.data());
          });
          setOverviewElements(overviewData);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    const addData = async () => {
      try {
        const overviewCollection = collection(
          firestore,
          "trips",
          trip.id,
          "overview"
        );

        const addedElements = [];

        for (const input of defaultInputs) {
          const newDocRef = doc(overviewCollection);
          const docId = newDocRef.id;

          const newElement = {
            id: docId,
            type: input.type,
            label: input.label,
            value: input.value,
          };

          await setDoc(newDocRef, newElement);
          addedElements.push(newElement);
        }

        setOverviewElements(addedElements);
      } catch (error) {
        console.error("Error add data:", error);
      }
    };
    setLoading(true);
    fetchData().then(() => setLoading(false));
  }, []);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
    Animated.timing(spinValue, {
      toValue: showOptions ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const addElemement = async (type) => {
    const overviewCollection = collection(
      firestore,
      "trips",
      trip.id,
      "overview"
    );
    if (type === "input") {
      const newDocRef = doc(overviewCollection);
      const docId = newDocRef.id;

      const newElement = {
        id: docId,
        type: type,
        label: "Nouvel input",
        value: "",
      };

      await setDoc(newDocRef, newElement);

      setOverviewElements((prevElements) => [...prevElements, newElement]);
    } else if (type === "todo") {
      const newDocRef = doc(overviewCollection);
      const docId = newDocRef.id;

      const newElement = {
        id: docId,
        type: type,
        label: "Nouvelle TodoList",
        tasks: [{ id: 1, text: "", completed: false }],
      };

      await setDoc(newDocRef, newElement);

      setOverviewElements((prevElements) => [...prevElements, newElement]);
    }
  };

  const handleElementChange = async (updatedElement) => {
    const updatedElements = overviewElements.map((element) =>
      element.id === updatedElement.id ? updatedElement : element
    );

    setOverviewElements(updatedElements);
    try {
      const overviewDocRef = doc(
        firestore,
        "trips",
        trip.id,
        "overview",
        updatedElement.id
      );
      await updateDoc(overviewDocRef, updatedElement);
    } catch (error) {
      console.error("Error update data:", error);
    }
  };

  const removeElement = async (itemId) => {
    const updatedElements = overviewElements.filter(
      (element) => element.id !== itemId
    );
    setOverviewElements(updatedElements);

    try {
      const overviewCollection = collection(
        firestore,
        "trips",
        trip.id,
        "overview"
      );
      const q = query(overviewCollection, where("id", "==", itemId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Erreur", "Aucun membre trouvé avec cet ID.");
        return;
      } else {
        querySnapshot.forEach(async (docSnapshot) => {
          await deleteDoc(docSnapshot.ref);
        });
      }
    } catch (error) {
      console.error("error remove data: ", error);
    }
  };

  const renderElement = ({ item }) => {
    if (item.type === "input") {
      return (
        <View
          style={{
            marginBottom: 10,
          }}
        >
          <Input
            item={item}
            handleElementChange={handleElementChange}
            removeElement={removeElement}
          />
        </View>
      );
    } else if (item.type === "todo") {
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <TodoList element={item} onElementChange={handleElementChange} />
          <TouchableOpacity
            onPress={() => removeElement(item.id)}
          >
            <Icon name="trash-can-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.purple} />
      </View>
    );
  }

  return (
    <View style={overviewStyles.container}>
      <Text style={textStyles.text}>
        Date du voyage: {trip.dateDebut} à {trip.dateFin}
      </Text>
      <Text style={textStyles.text}>Destination: {trip.nom}</Text>

      <View style={overviewStyles.listContainer}>
        <FlatList
          data={overviewElements}
          keyExtractor={(item) => item.id}
          renderItem={renderElement}
          contentContainerStyle={overviewStyles.flatListContentContainer}
        />
      </View>

      <TouchableOpacity style={overviewStyles.addButton} onPress={toggleOptions}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Icon name={"plus"} size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
      {showOptions && (
        <View style={overviewStyles.optionsContainer}>
          <RenderOptions options={addOptions} />
        </View>
      )}
    </View>
  );
};

export default Overview;