import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import { doc, updateDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { uploadImage, removeImage } from "../services/imageService";
import Cards from "../component/Card/Cards";
import { IMAGES } from "../theme/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import PicModal from "../component/PicModal";
import { firestore } from "../../FirebaseConfig";
import { textStyles } from "../style/textStyles";
import Btn from "../component/Btn";

const Profil = () => {
  const { user, updateUser, resetUserState } = useUser();
  const auth = FIREBASE_AUTH;

  const [isEditing, setIsEditing] = useState({
    pseudo: false,
    email: false,
    password: false,
  });
  const [newPseudo, setNewPseudo] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleToggleEdit = (field) => {
    if (field == "password") {
      sendPasswordResetEmail(auth, user.email)
        .then(() => {
          alert("Password reset email sent");
        })
        .catch((error) => {
          alert(error);
        });
    }
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const handleSavePress = async (field) => {
    switch (field) {
      case "pseudo":
        try {
          const { uid } = user;
          const userDocRef = doc(firestore, "users", uid);
          await updateDoc(userDocRef, { pseudo: newPseudo });
        } catch (error) {
          console.error(
            "Erreur lors de la mise à jour du pseudo dans Firebase",
            error
          );
        }
        updateUser({ ...user, pseudo: newPseudo });
        break;
      case "email":
        break;
      default:
        break;
    }
    setIsEditing({ ...isEditing, [field]: false });
  };

  return (
    <View
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,
      }}
    >
      <Text
        style={{
          ...textStyles.title,
          fontSize: 20,
          marginTop: 91,
          alignSelf: "center",
        }}
      >
        Profile
      </Text>
      <View style={{ alignItems: "center", marginTop: 30 }}>
        <TouchableOpacity style={styles.profilImageContainer}>
          <Image
            source={
              user.imageURL ? { uri: user.imageURL } : IMAGES.defaultProfile
            }
            style={styles.profilImage}
          />

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setModalVisible(true)}
          >
            <Icon name="camera-outline" size={20} color="#FFB703" />
          </TouchableOpacity>
        </TouchableOpacity>

        <PicModal
          docId={user.uid}
          collection="users"
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          uploadImage={uploadImage}
          removeImage={removeImage}
          updateUser={updateUser}
        />

        <Cards
          behaviorType="type1"
          isEditing={isEditing}
          newData={newPseudo}
          setNewData={setNewPseudo}
          type="pseudo"
          onPressProps={handleToggleEdit}
          setIsEditing={setIsEditing}
          handleSavePress={handleSavePress}
          name={user.pseudo}
        />

        <Cards
          behaviorType="type1"
          isEditing={isEditing}
          newData={newEmail}
          setNewData={setNewEmail}
          type="email"
          onPressProps={handleToggleEdit}
          setIsEditing={setIsEditing}
          handleSavePress={handleSavePress}
          name={user.email}
        />

        <Cards
          behaviorType="type2"
          isEditing={isEditing}
          type="password"
          onPressProps={handleToggleEdit}
          name="Changer de mot de passe"
        />

        <Btn name="Déconnexion" action={() => FIREBASE_AUTH.signOut()} />
      </View>
    </View>
  );
};

export default Profil;

const styles = StyleSheet.create({
  profilImageContainer: {
    marginBottom: 50,
  },

  profilImage: {
    borderRadius: 75,
    width: 150,
    height: 150,
    borderColor: "#f0f0f0",
    borderWidth: 5,
  },

  loginButton: {
    textAlign: "center",
    marginLeft: 30,
    backgroundColor: "#6E4B6B",
    borderRadius: 15,
    width: 150,
    height: 70,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  editButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 24,
    padding: 8,
    position: "absolute",
    right: 5,
    bottom: 5,
  },

  editButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },

  card: {
    width: 344,
    height: 68,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginBottom: 30,
    backgroundColor: "white",
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
    color: "#fff",
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

  buttonL: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6E4B6B",
    width: 100,
    height: 50,
    borderRadius: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  backButton: {
    width: 30,
    height: 25,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    width: 350,
    height: 150,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  button: {
    width: "30%",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 14,
    borderRadius: 10,
  },

  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
