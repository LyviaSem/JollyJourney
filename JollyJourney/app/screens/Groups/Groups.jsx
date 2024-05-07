import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  getDocs,
  where,
  query,
  onSnapshot,
} from "@firebase/firestore";
import { useUser } from "../../../context/UserContext";
import Cards from "../../component/Card/Cards";
import { images } from "../../theme/theme";
import { firestore } from "../../../FirebaseConfig";

const Groups = ({navigation }) => {
  const { user } = useUser();

  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  //   const fetchUserGroups = async () => {
  //     try {

  //       const groupsRef = collection(firestore, "groups");
  //       const querySnapshot = await getDocs(groupsRef);
  //       const groups = [];

  //       if(!querySnapshot.empty){
  //         for (const doc of querySnapshot.docs) {
  //           const groupId = doc.id;
  //           const membersRef = collection(firestore, "groups", groupId, "members");
  //           const memberSnapshot = await getDocs(query(membersRef, where("userId", "==", user.uid)));

  //           if (!memberSnapshot.empty) {
  //               const groupData = doc.data();
  //               groups.push({ id: groupId, ...groupData });
  //           }
  //         }
  //         setUserGroups(groups)
  //         setLoading(false)
  //       }
  //       setLoading(false)
  //     } catch (error) {
  //       console.error("Error fetching user groups: ", error);
  //       setLoading(false);
  //     }
  //   };

  // useEffect(() => {
  //   fetchUserGroups();
  // }, []);

  useEffect(() => {
    const fetchUserGroups = async () => {
        try {
            const groupsRef = collection(firestore, "groups");

            // Mettre en place un écouteur sur la collection "groups"
            const unsubscribe = onSnapshot(groupsRef, (snapshot) => {
                const groups = [];
                snapshot.forEach(async (doc) => {
                    const groupId = doc.id;
                    const membersRef = collection(firestore, "groups", groupId, "members");
                    const memberSnapshot = await getDocs(query(membersRef, where("userId", "==", user.uid)));

                    if (!memberSnapshot.empty) {
                        const groupData = doc.data();
                        groups.push({ id: groupId, ...groupData });
                    }
                });

                // Mettre à jour l'état des groupes de l'utilisateur
                setUserGroups(groups);
                setLoading(false);
            });

            return unsubscribe; // Renvoyer la fonction pour arrêter l'écoute lorsqu'elle n'est plus nécessaire
        } catch (error) {
            console.error("Error fetching user groups: ", error);
            setLoading(false);
        }
    };

    fetchUserGroups();

    unsubscribe();
}, []);


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderGroupItem = ({ item }) => (
    <Cards behaviorType="type2" name={item.name} image={item.imageURL? { uri: item.imageURL } : images.defaultProfile} onPressProps={{ routeName: "GroupDetails", additionalProps: {group: item, groupName: item.name, members: item.members, id: item.id, pic: item.imageURL }}}/>
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
          <View>
          <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 91, alignSelf: 'center' }}>Mes groupes</Text>
            <View style={{ position: 'absolute', top: 10, right: 10, padding: 10 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate("GroupSelectMembers")}
              >
                <Image
                  source={images.plusIcon}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
            </View>
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
            onPress={() => navigation.navigate("GroupSelectMembers")}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 30,
    backgroundColor: 'white',
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
  },
});
