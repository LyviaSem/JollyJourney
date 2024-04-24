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
  Modal
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "@firebase/firestore";
import { useUser } from "../../../context/UserContext";
import filter from "lodash.filter";
import Cards from "../../component/Card/Cards";
import ProfilIcon from "../../../assets/utilisateur.png";
import SearchBar from "../../component/SearchBar";

const CreateGroupes = ({route, navigation}) => {
  const { user } = useUser();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([user]);
  const [fullData, setFullData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nomDuGroupe, setNomDuGroupe] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [groupImage, setGroupImage] = useState(null);

  const handleSearch = (query) => {
    setSearch(query);
    const formattedQuery = query.toLowerCase();
    const filteredData = filter(fullData, (user) => {
      return contains(user, formattedQuery);
    });
    setSearchResults(filteredData);
  };

  const contains = ({ pseudo, email }, query) => {
    if (pseudo && pseudo.includes(query)) {
        return true;
    }

    const emailPrefix = email.split('@')[0];
    if (emailPrefix.includes(query)) {
        return true;
    }

    return false;
  };


  useEffect(() => {
    const fetchUserEmail = async () => {
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

  const toggleSelection = (event) => {
    
    const user = event;
  
    setSelectedUsers((prevUsers) => {
      const isUserSelected = prevUsers.some((u) => u.email === user.email);
  
      return isUserSelected
        ? prevUsers.filter((u) => u.email !== user.email)
        : [...prevUsers, user];
    });
  };

  const createGroup = async () => {
    try {
      const firestore = getFirestore();
      const groupCollection = collection(firestore, "groups");

      if (nomDuGroupe.trim() === "") {
        setErrorMessage("Vous devez saisir un nom de groupe");
        setErrorModalVisible(true);
        setTimeout(() => setErrorModalVisible(false), 3000);
        return;
      }

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

      navigation.goBack();

      const onGroupCreatedCallback = route.params?.onGroupCreated;
    if (onGroupCreatedCallback) {
      onGroupCreatedCallback();
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

  const renderItem = ({ item }) => (
    <Cards behaviorType="toggle" name={item.pseudo} image={ProfilIcon} isSelected={selectedUsers.includes(item)} onSelect={() => toggleSelection(item)}/>
  )

  return (
    <View
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 91, alignSelf: 'center' }}>Mes amis</Text>
      
      <SearchBar searchQuery={search} handleSearch={handleSearch} />

      <Modal 
      visible={errorModalVisible} transparent={true} backdropColor="none">
        <View style={styles.modalContainerError}>
          <View  style={styles.modalContentError}>
        <Text style={styles.modalErrorText}>{errorMessage}</Text>
        </View>
        </View>
      </Modal>

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.email}
        renderItem={renderItem}
      />

      <TouchableOpacity
        style={[styles.button, styles.Button, styles.arrowButton]}
        onPress={() => {
          if (selectedUsers.length > 1) {
            openModal();
          } else {
            setErrorMessage("Au moin un contact doit être sélectionné");
            setErrorModalVisible(true);
            setTimeout(() => setErrorModalVisible(false), 1500); // Fermer automatiquement après 3 secondes
          }
        }}
      >
        <Image
          source={require('../../../assets/avion-en-papier-blanc.png')}
          style={styles.arrowImage}
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "white", padding: 20 }}>
            <TextInput
              style={{ height: 40, borderColor: "gray", borderWidth: 1, marginBottom: 20, paddingHorizontal: 10, borderRadius: 5 }}
              placeholder="Nom du groupe"
              value={nomDuGroupe}
              onChangeText={(text) => setNomDuGroupe(text)}
            />

              <Image
                //source={{ uri: groupImage }}
                style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: 'black', marginBottom: 20 }}
              />
            <TouchableOpacity 
              //onPress={onButtonPress}
            >
              <Text>Sélectionner une photo</Text>
            </TouchableOpacity>
            {/* <Button title="Sélectionner une photo" onPress={openImagePicker} /> */}

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity
                style={{ padding: 10, borderRadius: 5, width: "45%", alignItems: "center", backgroundColor: "green" }}
                onPress={() => {
                  createGroup();
                  closeModal();
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Créer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ padding: 10, borderRadius: 5, width: "45%", alignItems: "center", backgroundColor: "red" }}
                onPress={closeModal}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Annuler</Text>
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
  arrowButton: {
    width: 50, // Ajustez la largeur selon vos besoins
    height: 50, // Ajustez la hauteur selon vos besoins
    position: 'absolute',
    bottom: 10, // Ajustez la position verticale selon vos besoins
    right: 10, // Ajustez la position horizontale selon vos besoins
  },
  arrowImage: {
    width: 30, // Ajustez la largeur de l'image selon vos besoins
    height: 30, // Ajustez la hauteur de l'image selon vos besoins
  },
  card: {
    width: 344,
    height: 68,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
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
  selectionButton: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  selectedIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#6E4B6B',
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
  modalContainerError: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 80,
  },
  modalContentError: {
    backgroundColor: 'rgba(0, 0, 0, 0.5);',
    padding: 20,
    borderRadius: 10,
    // elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalErrorText: {
    color: "white",
    fontWeight: "bold",
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
