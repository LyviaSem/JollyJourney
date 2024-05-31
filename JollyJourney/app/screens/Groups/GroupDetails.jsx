import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Button,
  FlatList,
  Platform,
  StatusBar,
} from "react-native";
import { getUserInfo, deleteMembers } from "../../services/firebaseFunction";
import { useUser } from "../../../context/UserContext";
import { images } from "../../theme/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomModal from "../../component/Card/DeleteMemberModal";
import ChangePic from "../../component/ChangePic";
import PicModal from "../../component/PicModal";
import { uploadImage } from "../../services/imageService";
import { removeImage } from "../../services/imageService";
import RenderOptions from "../../component/RenderOptions";

const GroupDetails = ({ route, navigation: { goBack, navigate } }) => {
  const { user, updateUserGroups } = useUser();
  const { group } = route.params;
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [creatorName, setCreatorName] = useState("");
  const [memberNames, setMemberNames] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState(() => () => {});
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState();

  useEffect(() => {
    if (user.uid === group.info.creator) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    getUserInfo(group.info.creator)
      .then((username) => setCreatorName(username))
      .catch((error) => console.error("Error fetching creator info:", error));

    Promise.all(group.members.map((member) => getUserInfo(member.userId)))
      .then((memberUsernames) => {
        const sortedMemberUsernames = memberUsernames.sort((a, b) => {
          if (a.id === user.uid) return -1;
          if (b.id === user.uid) return 1;
          return 0;
        });
        setMemberNames(sortedMemberUsernames);
      })
      .catch((error) => console.error("Error fetching member info:", error));

    setImageUri(group.info.imageURL);
  }, [group]);

  const handleOpenModal = (message, action) => {
    setModalMessage(message);
    setModalAction(() => action);
    setIsVisible(true);
  };

  const handleDeleteMember = (memberId) => {
    deleteMembers(
      group.info.id,
      memberId,
      updateUserGroups,
      navigate,
      user.uid
    );
    setIsVisible(false);
  };

  return (
    <View
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => goBack()}
        style={{ top: 55, position: "absolute", left: 30 }}
      >
        <Image source={images.planeBtn} style={{ width: 40, height: 34 }} />
      </TouchableOpacity>
      <View style={styles.groupProfilContainer}>
        <ChangePic
          image={imageUri}
          defaultImage={images.defaultProfile}
          setModalVisible={setModalVisible}
          picStyle={{ marginBottom: 0 }}
        />
        <PicModal
          collection="groups"
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          uploadImage={uploadImage}
          removeImage={removeImage}
          imageUri={setImageUri}
        />
        <Text style={styles.groupName}>{group.info.name}</Text>
        <View style={styles.groupInfoContainer}>
          {console.log(styles.groupInfoContainer)}
          <Text style={styles.memberCount}>
            Membres: {group.members.length}
          </Text>
          <Text style={styles.createdBy}>Créé par {creatorName.pseudo} </Text>
        </View>
      </View>
      <View style={{ flex: 1, width: 380 }}>
        <FlatList
          data={memberNames}
          contentContainerStyle={{ gap: 10, }}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#000",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 20,
                }}
              >
                <Image
                  source={
                    item.imageURL
                      ? { uri: item.imageURL }
                      : images.defaultProfile
                  }
                  style={styles.profilImage}
                />
                <Text>{item.pseudo}</Text>
              </View>
              {isAdmin && item.id !== user.uid && (
                <TouchableOpacity
                  onPress={() =>
                    handleOpenModal(
                      `Êtes vous sur de vouloir supprimer ${item.pseudo} de ce groupe ?`,
                      () => handleDeleteMember(item.id)
                    )
                  }
                >
                  <Icon name="trash-can-outline" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      <TouchableOpacity
        style={[styles.button]}
        onPress={() =>
            handleOpenModal("Êtes vous sûr de vouloir quiter ce groupe ?", () =>
              handleDeleteMember(user.uid)
            )
          }
      >
        <Icon name="exit-to-app" size={24} color="#fff" />
        <Text style={styles.buttonText}>Quitter le groupe</Text>
      </TouchableOpacity>

      <CustomModal
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        message={modalMessage}
        onConfirm={modalAction}
      />
    </View>
  );
};

export default GroupDetails;

const styles = {
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  groupImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  groupName: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  memberCount: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  createdBy: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  adminButtons: {
    flexDirection: "row",
    marginVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  profilImage: {
    marginBottom: 5,
    borderRadius: 75,
    width: 50,
    height: 50,
  },
  adminButtons: {
    flexDirection: "row",
    marginVertical: 10,
  },
  optionsContainer: {
    width: 200,
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "white", // ou la couleur de votre choix
    borderRadius: 5,
    padding: 10,
    elevation: 5, // pour Android
    shadowColor: "#000", // pour iOS
    shadowOffset: { width: 0, height: 2 }, // pour iOS
    shadowOpacity: 0.8, // pour iOS
    shadowRadius: 2, // pour iOS
  },
  groupProfilContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  groupInfoContainer: {
    gap: 20,
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#6E4B6B",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection:"row",
    gap:20,
    padding: 20,
    marginBottom: 25
  },
  buttonText:{
    color:"#fff",
  }
};
