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
import { groupInfoStyle } from "../../style/groupInfoStyle";

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
    <View style={groupInfoStyle.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={groupInfoStyle.backButtonContainer}
      >
        <Image source={IMAGES.planeBtn} style={[groupInfoStyle.backButton]} />
      </TouchableOpacity>
      <Text style={groupInfoStyle.title}>Nouveau groupe</Text>
      <View style={groupInfoStyle.groupInfoContainer}>
        <View style={groupInfoStyle.groupInfo}>
          <TouchableOpacity
            style={groupInfoStyle.profilImageContainer}
            onPress={() => setModalVisible(true)}
          >
            <Image
              source={imageUri ? { uri: imageUri } : IMAGES.defaultProfile}
              style={groupInfoStyle.profilImage}
            />
          </TouchableOpacity>
          <TextInput
            style={groupInfoStyle.input}
            placeholder="Nom du groupe"
            value={nomDuGroupe}
            onChangeText={(text) => setNomDuGroupe(text)}
          />
        </View>
        <PicModal
          collection="groups"
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          uploadImage={uploadImage}
          removeImage={removeImage}
          imageUri={setImageUri}
        />
        <TouchableOpacity
          style={[
            groupInfoStyle.button,
            groupInfoStyle.Button,
            groupInfoStyle.arrowButton,
          ]}
          onPress={() => {
            createGroup();
          }}
        >
          <Icon name="check" size={24} color="#fff" />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        ></View>
      </View>
      <Modal
        visible={errorModalVisible}
        transparent={true}
        backdropColor="none"
      >
        <View style={groupInfoStyle.modalContainerError}>
          <View style={groupInfoStyle.modalContentError}>
            <Text style={groupInfoStyle.modalErrorText}>{errorMessage}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GroupInfo;
