import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
} from "@firebase/firestore";
import { useUser } from "../../../context/UserContext";
import City from "../../component/City";

function Travel({navigation}) {
  const { user } = useUser();

  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserTravels = async () => {
    const firestore = getFirestore();
    try {
      const userGroupList = collection(firestore, "members");
      const membersQuery = query(userGroupList, where("userId", "==", user.uid));
      const membersSnapshot = await getDocs(membersQuery);
      
      if(!membersQuery.empty){
        const groupIds = membersSnapshot.docs.map((doc) => doc.data())

        const voyagesPromises = groupIds.map(async (groupId) => {
          const userTripsList = collection(firestore, "trips")
          const tripsQuery = query(userTripsList, where('groupId', '==', groupId.groupId))
          const voyagesSnapshot = await getDocs(tripsQuery);
          return voyagesSnapshot.docs.map((doc) => doc.data());
        });

        const voyagesParGroupes = await Promise.all(voyagesPromises);

        const userAllTrips = voyagesParGroupes.flat();
        
        setAllTrips(userAllTrips);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user groups: ", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserTravels();
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderTripsItem = ({ item }) => (
    <City name={item.nom} picture={item.imageURL} onPressProps={{ routeName: "GroupTrip", additionalProps: { trip: item }}}/>
  )

  return (
    <ScrollView
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,
      }}
    >
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 91, alignSelf: 'center' }}>Mes voyages</Text>
      {allTrips.length > 0 ? (
        <>
            <View style={{ position: 'absolute', top: 10, right: 10, padding: 10 }}>
              {/* <TouchableOpacity
                onPress={() => navigation.navigate("CreateGroup", { onGroupCreated: updateGroups })}
              >
                <Image
                  source={require('../../../assets/plus.png')}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity> */}
            </View>

          <View style={{ alignItems: 'center', marginTop: 30 }}>
            <FlatList
              data={allTrips}
              keyExtractor={(item) => item.id}
              renderItem={renderTripsItem}
            />
          </View>
        </>
      ) : (
        <View style={{ alignItems: "center", }}>
          {/* <TouchableOpacity
            style={[styles.button, styles.Button]}
            onPress={() => navigation.navigate("CreateGroup", { onGroupCreated: updateGroups })}
          > */}
            <Text style={styles.buttonText}>Tu n'a pas de voyage progamé</Text>
          {/* </TouchableOpacity> */}
        </View>
      )}
      </View>
    </ScrollView>
  );
}

export default Travel;

const styles = StyleSheet.create({

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
  Button: {
    backgroundColor: "#6E4B6B",
    borderRadius: 15,
    width: 190,
    height: 57,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  backButton: {
    width: 30,
    height: 25
    ,
  },
});
