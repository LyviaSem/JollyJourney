import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  FlatList,
  Text,
  ScrollView,
  Platform,
  SafeAreaView,
} from "react-native";
import React, { useState, useLayoutEffect } from "react";
import { collection, where, query, onSnapshot } from "@firebase/firestore";
import Cards from "../../component/Card/Cards";
import { IMAGES } from "../../theme/theme";
import { firestore } from "../../../FirebaseConfig";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RenderOptions from "../../component/RenderOptions";

const GroupTrips = ({ route, navigation }) => {
  const { group } = route.params;

  const [groupTrips, setGroupTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renderOptions, setRenderOptions] = useState(false);

  const redirectOptions = [
    {
      id: "1",
      name: "Créer un nouveau voyage",
      action: () =>
        navigation.navigate("CreateTravel", {
          groupTrips: groupTrips,
          groupId: group.info.id,
        }),
    },
    {
      id: "2",
      name: "Infos du groupe",
      action: () => navigation.navigate("GroupDetails", { group: group }),
    },
  ];

  useLayoutEffect(() => {
    setLoading(true);
    const groupId = group.info.id;

    try {
      const trips = collection(firestore, "trips");
      const q = query(trips, where("groupId", "==", groupId));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const tripData = [];
        snapshot.forEach((doc) => {
          tripData.push(doc.data());
        });
        setGroupTrips(tripData);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des voyages du groupe:",
        error
      );
      setLoading(false);
    }
  }, []);

  const renderTripsItem = ({ item }) => (
    <Cards
      behaviorType="type2"
      name={item.nom}
      image={item.imageURL ? { uri: item.imageURL } : IMAGES.defaultProfile}
      onPressProps={{ routeName: "Trip", additionalProps: { trip: item } }}
    />
  );

  // if(loading){
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
          source={
            group.info.imageURL
              ? { uri: group.info.imageURL }
              : IMAGES.defaultImage
          }
          style={styles.backgroundImage}
        >
          <View style={styles.overlay} />
          <TouchableOpacity
            onPress={() => navigation.navigate("Groups")}
            style={{ top: 25, left: 20 }}
          >
            <Image source={IMAGES.planeBtn} style={styles.backButton} />
          </TouchableOpacity>
        </ImageBackground>

        <View style={{ position: "absolute", top: 20, right: 10 }}>
          <TouchableOpacity onPress={() => setRenderOptions(!renderOptions)}>
            <Icon name={"dots-vertical"} size={35} color="#6E4B6B" />
          </TouchableOpacity>
          {renderOptions && (
            <View style={styles.optionsContainer}>
              <RenderOptions options={redirectOptions} />
            </View>
          )}
        </View>

        {groupTrips.length > 0 ? (
          <SafeAreaView
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <FlatList
              data={groupTrips}
              keyExtractor={(item) => item.id}
              renderItem={renderTripsItem}
            />
          </SafeAreaView>
        ) : (
          <View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                marginTop: 91,
                alignSelf: "center",
              }}
            >
              Pas encore de voyage pour ce groupe
            </Text>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={[styles.button, styles.Button]}
                onPress={() =>
                  navigation.navigate("CreateTravel", {
                    groupTrips: groupTrips,
                    groupId: group.info.id,
                  })
                }
              >
                <Text style={styles.buttonText}>Créer le premier voyage</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
  //}
};

export default GroupTrips;

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
overlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
},
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: "80%",
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
  Button: {
    backgroundColor: "#6E4B6B",
    borderRadius: 15,
    width: 190,
    height: 57,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsContainer: {
    width: 200,
    position: "absolute",
    top: 40, // ajustez cette valeur en fonction de vos besoins
    right: 0,
    backgroundColor: "white", // ou la couleur de votre choix
    borderRadius: 5,
    padding: 10,
    elevation: 5, // pour Android
    shadowColor: "#000", // pour iOS
    shadowOffset: { width: 0, height: 2 }, // pour iOS
    shadowOpacity: 0.8, // pour iOS
    shadowRadius: 2, // pour iOS
  },
});
