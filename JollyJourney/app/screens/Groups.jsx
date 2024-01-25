import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  StyleSheet,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
  doc,
  getDoc,
} from "@firebase/firestore";
import { useUser } from "../../context/UserContext";

const Groups = ({ navigation }) => {
  const { user } = useUser();

  const [userGroups, setUserGroups] = useState([]);

  useEffect(() => {
    const fetchUserGroups = async (firestore) => {
      try {
        const firestore = getFirestore();
        const userl = collection(firestore, "members");
        const q = query(userl, where("userId", "==", user.uid));
        const userSnapshot = await getDocs(q);
        if (!userSnapshot.empty) {
          const UserData = userSnapshot.docs.map((doc) => doc.data());

          const groups = UserData.map((user) => user.groupId || []);

          const groupPromises = groups.map(async (groupId) => {
            const groupDocRef = collection(firestore, "groups");
            const q = query(groupDocRef, where("id", "==", groupId));
            const groupDoc = await getDocs(q);
            console.log(groupDoc.docs.map((doc) => doc.data()));
            return groupDoc.docs.map((doc) => doc.data());
          });

          const groupData = await Promise.all(groupPromises);
          console.log(groupData);
          const flattenedGroups = groupData.flat();

          setUserGroups(flattenedGroups);
        } else {
          console.log("Utilisateur non trouvé.");
        }
      } catch (error) {
        console.error("Error fetching user groups: ", error);
      }
    };

    fetchUserGroups();
  }, [user]);

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Expenses", { members: item.members })}
    >
      <View>
        <Text>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,
      }}
    >
      {userGroups.length > 0 ? (
        <FlatList
          data={userGroups}
          keyExtractor={(item) => item.id}
          renderItem={renderGroupItem}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Tu n'es encore dans aucun groupe</Text>
          <TouchableOpacity
            style={[styles.button, styles.Button]}
            onPress={() => navigation.navigate("CreateGroup")}
          >
            <Text style={styles.buttonText}>Créer un groupe</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Groups;

const styles = StyleSheet.create({
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
});
