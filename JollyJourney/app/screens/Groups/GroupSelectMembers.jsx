import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  FlatList,
  Modal, 
  Platform
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs
} from "@firebase/firestore";
import { useUser } from "../../../context/UserContext";
import filter from "lodash.filter";
import Cards from "../../component/Card/Cards";
import SearchBar from "../../component/SearchBar";
import { IMAGES } from "../../theme/theme";

const GroupSelectMembers = ({navigation}) => {

  const { user, selectedUsers, setSelectedUsers } = useUser();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    const fetchUserEmail = async (user) => {
      setSelectedUsers([user])
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
    fetchUserEmail(user);
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

  const renderItem = ({ item }) => {
    return (
      <Cards behaviorType="toggle" name={item.pseudo} image={item.imageURL ? { uri: item.imageURL } : IMAGES.defaultProfile} isSelected={selectedUsers.includes(item)} onSelect={() => toggleSelection(item)}/>
    );
  };

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
        visible={errorModalVisible} transparent={true} backdropColor="none"
      >
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
            navigation.navigate("GroupInfo", {creatorId: user.uid})
          } else {
            setErrorMessage("Au moins un contact doit être sélectionné");
            setErrorModalVisible(true);
            setTimeout(() => setErrorModalVisible(false), 1500);
          }
        }}
      >
        <Image
          source={IMAGES.whitePlaneBtn}
          style={styles.arrowImage}
        />
      </TouchableOpacity>

    </View>
  );
}

export default GroupSelectMembers;

const styles = StyleSheet.create({
  arrowButton: {
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  arrowImage: {
    width: 30,
    height: 30,
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
