import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  StyleSheet,
  Image,
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

const Groups = ({navigation }) => {
  const { user } = useUser();

  const [userGroups, setUserGroups] = useState([]);

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

  useEffect(() => {
    fetchUserGroups();
  }, [user]);

  const updateGroups = async () => {
    fetchUserGroups();
  };

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("GroupDetails")}
    >
      <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../../assets/utilisateur.png')}
                style={styles.profileImage}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
              </View>
            </View>
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
        <>
          <View style={{ position: 'absolute', top: 10, right: 10, padding: 10 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("CreateGroup", { onGroupCreated: updateGroups })}
            >
              <Image
                source={require('../../assets/plus.png')}
                style={{ width: 16.17, height: 16.17 }}
              />
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center', marginTop: 30 }}>
            <FlatList
              data={userGroups}
              keyExtractor={(item) => item.id}
              renderItem={renderGroupItem}
            />
          </View>
        </>
      ) : (
        <View>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 91, alignSelf: 'center' }}>Mes groupes</Text>
        <View style={{ alignItems: "center", }}>
          <TouchableOpacity
            style={[styles.button, styles.Button]}
            onPress={() => navigation.navigate("CreateGroup", { onGroupCreated: updateGroups })}
          >
            <Text style={styles.buttonText}>Créer mon premier groupe</Text>
          </TouchableOpacity>
        </View>
      </View>
      

      )}
    </View>
  );
};

export default Groups;

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
    backgroundColor: 'rgba(255, 255, 255, 0.27)', // Ajout de la couleur de fond
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
});
