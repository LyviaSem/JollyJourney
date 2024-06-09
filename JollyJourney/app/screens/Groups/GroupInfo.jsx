import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
  useWindowDimensions
} from "react-native";
import React, { useState } from "react";
import { firestore } from "../../../FirebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { IMAGES } from "../../theme/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import PicModal from "../../component/PicModal";
import { uploadImage, removeImage } from "../../services/imageService";
import { useUser } from "../../../context/UserContext";


const GroupInfo = ({ route, navigation }) => {
  const { creatorId } = route.params;
  

  const [nomDuGroupe, setNomDuGroupe] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState();
  const { user, selectedUsers, setSelectedUsers } = useUser();

  const isAdmin = (member) => {
    return member.uid === user.uid;
  };

  const createGroup = async () => {
    try {
      const groupCollection = collection(firestore, "groups");
      const onGroupCreatedCallback = route.params?.onGroupCreated;

      if (nomDuGroupe.trim() === "") {
        setErrorMessage("Vous devez saisir un nom de groupe");
        setErrorModalVisible(true);
        setTimeout(() => setErrorModalVisible(false), 3000);
        return;
      }

      const newGroupDocRef = await addDoc(groupCollection, {
        name: nomDuGroupe,
        creator: creatorId,
        createdAt: serverTimestamp(),
        imageURL: imageUri || null,
      });

      const groupId = newGroupDocRef.id;

      await updateDoc(newGroupDocRef, { id: groupId });

      const memberData = [];

      for (const member of selectedUsers) {
        const membreCollection = collection(
          firestore,
          "groups",
          groupId,
          "members"
        );

        await addDoc(membreCollection, {
          userId: member.uid,
          role: isAdmin(member) ? "admin" : "member",
        });

        memberData.push({
          userId: member.uid,
          role: isAdmin(member) ? "admin" : "member",
        });
      }

      const docSnapshot = await getDoc(newGroupDocRef);

      if (docSnapshot.exists()) {
        const groupData = docSnapshot.data();

        const groupObject = {
          info: {
            ...groupData,
            id: groupId,
          },
          members: memberData,
        };
        setSelectedUsers([]);
        navigation.navigate("GroupTrips", { group: groupObject });
      }

      if (onGroupCreatedCallback) {
        onGroupCreatedCallback();
      }
    } catch (error) {
      console.error("Erreur lors de la création du groupe : ", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
        <Image source={IMAGES.planeBtn} style={[styles.backButton]} />
      </TouchableOpacity>
      <Text style={styles.title}>Nouveau groupe</Text>
      <View style={styles.groupInfoContainer}>
        <View style={styles.groupInfo}>
          <TouchableOpacity style={styles.profilImageContainer} onPress={() => setModalVisible(true)}>
            <Image source={imageUri ? { uri: imageUri } : IMAGES.defaultProfile} style={styles.profilImage} />
          </TouchableOpacity>
          <TextInput style={styles.input} placeholder="Nom du groupe" value={nomDuGroupe} onChangeText={(text) => setNomDuGroupe(text)} />
        </View>
        <PicModal collection="groups" modalVisible={modalVisible} setModalVisible={setModalVisible} uploadImage={uploadImage} removeImage={removeImage} imageUri={setImageUri} />
        <TouchableOpacity style={[styles.button, styles.Button, styles.arrowButton]} onPress={() => { createGroup(); }}>
          <Icon name="check" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}></View>
      </View>
      <Modal visible={errorModalVisible} transparent={true} backdropColor="none">
        <View style={styles.modalContainerError}>
          <View style={styles.modalContentError}>
            <Text style={styles.modalErrorText}>{errorMessage}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GroupInfo;

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;



const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#FEF5EE",
    flex: 1,
  },
  backButtonContainer: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.05,
    left: SCREEN_WIDTH * 0.03,
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_WIDTH * 0.15,
  },
  title: {
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: SCREEN_WIDTH * 0.06,
    marginTop: SCREEN_HEIGHT * 0.1, 
  },
  groupInfoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  groupInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SCREEN_HEIGHT * 0.05,
    height: SCREEN_HEIGHT * 0.1,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: SCREEN_WIDTH * 0.013,
    width: SCREEN_WIDTH * 0.95,
    paddingHorizontal: SCREEN_WIDTH * 0.025,
    marginBottom: SCREEN_HEIGHT * 0.025,
  },
  profilImageContainer: {
    marginRight: SCREEN_WIDTH * 0.03,
  },
  input: {
    paddingHorizontal: SCREEN_WIDTH * 0.025,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  Button: {
    backgroundColor: "#6E4B6B",
    borderRadius: SCREEN_WIDTH * 0.05,
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.15,
    margin: SCREEN_WIDTH * 0.025,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowButton: {
    width: SCREEN_WIDTH * 0.125,
    height: SCREEN_WIDTH * 0.125,
    position: "absolute",
    bottom: SCREEN_HEIGHT * 0.025,
    right: SCREEN_WIDTH * 0.025,
  },
  modalContainerError: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: SCREEN_HEIGHT * 0.2,
  },
  modalContentError: {
    backgroundColor: "rgba(0, 0, 0, 0.5);",
    padding: SCREEN_WIDTH * 0.05,
    borderRadius: SCREEN_WIDTH * 0.025,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalErrorText: {
    color: "white",
    fontWeight: "bold",
  },
  profilImage: {
    borderRadius: SCREEN_WIDTH * 0.1,
    width: SCREEN_WIDTH * 0.125,
    height: SCREEN_WIDTH * 0.125,
    borderColor: "black",
    borderWidth: 1,
  },
  backButton: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.08, // Ajuster la taille de l'image ici
  },
});

