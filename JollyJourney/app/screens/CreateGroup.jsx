import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  FlatList,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "@firebase/firestore";
import { useUser } from "../../context/UserContext";
import filter from "lodash.filter";
import Modal from "react-native-modal";

function CreateGroupes({ navigation }) {
  const { user } = useUser();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([user]);
  const [fullData, setFullData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nomDuGroupe, setNomDuGroupe] = useState("");

  const handleSearch = (query) => {
    setSearch(query);
    const formattedQuery = query.toLowerCase();
    const filteredData = filter(fullData, (user) => {
      return contains(user, formattedQuery);
    });
    setSearchResults(filteredData);
  };

  const contains = ({ pseudo, email }, query) => {
    if ((pseudo && pseudo.includes(query)) || email.includes(query)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const fetchUserEmail = async (firestore) => {
      try {
        const firestore = getFirestore();
        const UserSnapshot = await getDocs(collection(firestore, "users"));
        const UserData = UserSnapshot.docs.map((doc) => doc.data());
        const currentUser = user && user.email;
        const filteredUserData = UserData.filter((user) => {
          return currentUser ? user.email !== currentUser : true;
        });
        setSearchResults(filteredUserData);
        setFullData(filteredUserData);
      } catch (error) {
        console.error("Error fetching users: ", error);
        throw error;
      }
    };
    fetchUserEmail();
  }, []);

  const addUserToSelection = (user) => {
    setSelectedUsers((prevUsers) => [...prevUsers, user]);
  };

  const removeUserFromSelection = (user) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.filter((u) => u.email !== user.email)
    );
  };

  const createGroup = async () => {
    try {
      const firestore = getFirestore();
      const groupCollection = collection(firestore, "groups");

      const newGroupDocRef = await addDoc(groupCollection, {
        name: nomDuGroupe,
        members: [...selectedUsers.map((user) => user.uid)],
        creator: user.uid,
        createdAt: serverTimestamp(),
      });

      const groupId = newGroupDocRef.id;

      await updateDoc(newGroupDocRef, { id: groupId });

      for (const member of selectedUsers) {
        const membreCollection = collection(firestore, "members");

        await addDoc(membreCollection, {
          groupId: groupId,
          userId: member.uid,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création du groupe : ", error);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,
      }}
    >
      <TextInput
        placeholder="search"
        clearButtonMode="always"
        autoCapitalize="none"
        style={{
          color: "#000000",
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 28.5,
          marginTop: 49,
          marginBottom: 20,
          backgroundColor: "#C4C4C4",
          opacity: 0.22,
          width: 344,
        }}
        value={search}
        onChangeText={(query) => handleSearch(query)}
      />
      {console.log(searchResults)}
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => addUserToSelection(item)}>
            <View
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {item.pseudo}
              </Text>
              <Text style={{ fontSize: 18 }}>{item.email}</Text>
              {selectedUsers.some((user) => user.email === item.email) && (
                <TouchableOpacity onPress={() => removeUserFromSelection(item)}>
                  <Text style={{ color: "red" }}>Retirer la sélection</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={[styles.button, styles.Button]}
        onPress={openModal}
      >
        <Text style={styles.buttonText}>Créer le groupe</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.modalInput}
              placeholder="Nom du groupe"
              value={nomDuGroupe}
              onChangeText={(text) => setNomDuGroupe(text)}
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "green" }]}
                onPress={() => {
                  createGroup();
                  closeModal();
                }}
              >
                <Text style={styles.modalButtonText}>Créer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "red" }]}
                onPress={closeModal}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default CreateGroupes;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 10,
  },
  textPseudo: {
    fontSize: 17,
    marginLeft: 10,
    fontWeight: "600",
  },
  textEmail: {
    fontSize: 14,
    marginLeft: 10,
    color: "grey",
  },
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
