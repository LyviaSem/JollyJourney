import {
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  FlatList,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useLayoutEffect } from "react";
import { collection, where, query, onSnapshot } from "@firebase/firestore";
import Cards from "../../component/Card/Cards";
import { IMAGES } from "../../theme/theme";
import { firestore } from "../../../FirebaseConfig";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RenderOptions from "../../component/RenderOptions";
import { groupTripsStyle } from "../../style/groupTripsStyle";
import Btn from "../../component/Btn";
import { textStyles } from "../../style/textStyles";
import { COLORS } from "../../theme/theme";

const GroupTrips = ({ route, navigation }) => {
  const { group } = route.params;

  const [groupTrips, setGroupTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renderOptions, setRenderOptions] = useState(false);

  const redirectOptions = [
    {
      id: "1",
      name: "Créer un voyage",
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
    <View style={groupTripsStyle.container}>
      <View>
        <ImageBackground
          source={
            group.info.imageURL
              ? { uri: group.info.imageURL }
              : IMAGES.defaultImage
          }
          style={groupTripsStyle.backgroundImage}
        >
          <View style={groupTripsStyle.overlay} />
          <TouchableOpacity
            onPress={() => navigation.navigate("Groups")}
            style={groupTripsStyle.backButtonContainer}
          >
            <Image
              source={IMAGES.planeBtn}
              style={groupTripsStyle.backButton}
            />
          </TouchableOpacity>
        </ImageBackground>

        <View style={groupTripsStyle.optionsIconContainer}>
          <TouchableOpacity onPress={() => setRenderOptions(!renderOptions)}>
            <Icon name={"dots-vertical"} size={35} color="#6E4B6B" />
          </TouchableOpacity>
          {renderOptions && (
            <View style={groupTripsStyle.optionsContainer}>
              <RenderOptions options={redirectOptions} />
            </View>
          )}
        </View>

        {groupTrips.length > 0 ? (
          <View style={groupTripsStyle.safeAreaView}>
            <FlatList
              style={groupTripsStyle.flatlistHeight}
              data={groupTrips}
              keyExtractor={(item) => item.id}
              renderItem={renderTripsItem}
            />
          </View>
        ) : (
          <View>
            <Text style={groupTripsStyle.noTripText}>
              Pas encore de voyage pour ce groupe
            </Text>
            <View style={groupTripsStyle.centeredContainer}>
              <Btn
                name="Créer le premier voyage"
                action={() =>
                  navigation.navigate("CreateTravel", {
                    groupTrips: groupTrips,
                    groupId: group.info.id,
                  })
                }
                buttonStyle={{ marginTop: 20 }}
                textStyle={textStyles.buttonText}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default GroupTrips;
