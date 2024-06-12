import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
} from "react-native";
import { getFirestore, collection, getDocs } from "@firebase/firestore";
import { useUser } from "../../../context/UserContext";
import filter from "lodash.filter";
import Cards from "../../component/Card/Cards";
import SearchBar from "../../component/SearchBar";
import { IMAGES } from "../../theme/theme";
import { selectMembersStyle } from "../../style/selectMembersStyle";

const GroupSelectMembers = ({ navigation }) => {
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

    const emailPrefix = email.split("@")[0];
    if (emailPrefix.includes(query)) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    const fetchUserEmail = async (user) => {
      setSelectedUsers([user]);
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
      <Cards
        behaviorType="toggle"
        name={item.pseudo}
        image={item.imageURL ? { uri: item.imageURL } : IMAGES.defaultProfile}
        isSelected={selectedUsers.includes(item)}
        onSelect={() => toggleSelection(item)}
      />
    );
  };

  return (
    <View style={selectMembersStyle.container}>
      <Text style={selectMembersStyle.headerText}>Mes amis</Text>

      <SearchBar searchQuery={search} handleSearch={handleSearch} />

      <Modal
        visible={errorModalVisible}
        transparent={true}
        backdropColor="none"
      >
        <View style={selectMembersStyle.modalContainerError}>
          <View style={selectMembersStyle.modalContentError}>
            <Text style={selectMembersStyle.modalErrorText}>{errorMessage}</Text>
          </View>
        </View>
      </Modal>

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.email}
        renderItem={renderItem}
      />

      <TouchableOpacity
        style={[selectMembersStyle.button, selectMembersStyle.Button, selectMembersStyle.arrowButton]}
        onPress={() => {
          if (selectedUsers.length > 1) {
            navigation.navigate("GroupInfo", { creatorId: user.uid });
          } else {
            setErrorMessage("Au moins un contact doit être sélectionné");
            setErrorModalVisible(true);
            setTimeout(() => setErrorModalVisible(false), 1500);
          }
        }}
      >
        <Image source={IMAGES.whitePlaneBtn} style={selectMembersStyle.arrowImage} />
      </TouchableOpacity>
    </View>
  );
};

export default GroupSelectMembers;
