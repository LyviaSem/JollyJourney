import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import {
  collection,
  where,
  getDocs,
  query,
  onSnapshot,
} from "@firebase/firestore";
import { useUser } from "../../../context/UserContext";
import Thumbnail from "../../component/thumbnail";
import { firestore } from "../../../FirebaseConfig";
import { COLORS } from "../../theme/theme";
import { travelStyle } from "../../style/travelStyle";

function Travels({}) {
  const { userGroups, loadingGroups } = useUser();

  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserTravels = async () => {
    try {
      setLoading(true);
      const groupIds = userGroups.map((group) => group.info.id);

      if (groupIds.length > 0) {
        console.log("groupIds not empty");

        const unsubscribe = onSnapshot(
          query(
            collection(firestore, "trips"),
            where("groupId", "in", groupIds)
          ),
          (snapshot) => {
            let trips = snapshot.docs.map((doc) => doc.data());

            // Tri des voyages par date de début la plus proche
            trips.sort((a, b) => {
              const dateA = new Date(a.dateDebut);
              const dateB = new Date(b.dateDebut);
              return dateA - dateB;
            });

            setAllTrips(trips);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching trips: ", error);
            setLoading(false);
          }
        );

        return unsubscribe;
      } else {
        setAllTrips([]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user groups: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loadingGroups && userGroups.length > 0) {
      const unsubscribe = fetchUserTravels();

      return () => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      };
    }
  }, [userGroups, loadingGroups]);

  if (loading || loadingGroups) {
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

  const renderTripsItem = ({ item }) => (
    <Thumbnail
      name={item.nom}
      picture={item.imageURL}
      onPressProps={{ routeName: "Trip", additionalProps: { trip: item } }}
    />
  );

  return (
    <SafeAreaView style={travelStyle.safeAreaView}>
      <View style={{ flex: 1 }}>
        <Text style={travelStyle.headerText}>Mes voyages</Text>
        {allTrips.length > 0 ? (
          <View style={travelStyle.flatListContainer}>
            <FlatList
              contentContainerStyle={travelStyle.flatListContentContainer}
              data={allTrips}
              keyExtractor={(item) => item.id}
              renderItem={renderTripsItem}
            />
          </View>
        ) : (
          <View style={travelStyle.noTripsContainer}>
            <Text style={travelStyle.noTripsText}>
              Tu n'as pas de voyage programmé
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

export default Travels;
