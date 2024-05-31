import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
} from "react-native";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { stylesApercuContent } from "../../style/StyleApercuContent";
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

const ApercuContent = ({ route, navigation }) => {
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
          <Input item={item} handleElementChange={handleElementChange} removeElement={removeElement} />
        </View>
      );
    } else if (item.type === "todo") {
      return (
        <View
        style={{flexDirection:"row", alignItems:"center", gap:10, marginBottom: 10}}
        >
          <TodoList element={item} onElementChange={handleElementChange} />
          <TouchableOpacity
        style={stylesApercuContent.deleteButton}
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        paddingTop: 10,
        backgroundColor: "#FEF5EE",
        flex: 1,
      }}
    >
      <Text>
        Date du voyage: {trip.dateDebut} à {trip.dateFin}
      </Text>
      <Text>Destination: {trip.nom}</Text>

      <View style={{ justifyContent: "center", alignItems: "center", padding:10 }}>
        <FlatList
          data={overviewElements}
          keyExtractor={(item) => item.id}
          renderItem={renderElement}
          contentContainerStyle={{}}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={toggleOptions}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Icon name={"plus"} size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
      {showOptions && (
        <View style={styles.optionsContainer}>
          <RenderOptions options={addOptions} />
        </View>
      )}
    </View>
  );
};

export default ApercuContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#6E4B6B",
    gap: -5,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  selectedTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "blue",
  },
  tabText: {
    fontSize: 16,
    color: "black",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    width: 414,
    height: 189,
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 34,
  },
  addButton: {
    backgroundColor: "#6E4B6B",
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    elevation: 5,
  },
  optionsContainer: {
    position: "absolute",
    bottom: 80,
    right: 20,
    width: 200,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  optionText: {
    color: "black",
    fontSize: 16,
  },
});
