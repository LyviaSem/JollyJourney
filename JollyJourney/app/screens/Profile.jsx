import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import React, {useState} from "react";
import { useUser } from "../../context/UserContext";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { sendPasswordResetEmail, updateEmail } from "firebase/auth";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { uploadImage, removeImage } from "../services/imageService";
import Cards from "../component/Card/Cards";
import { images } from "../theme/theme";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


const Profil = () => {
  const { user, updateUser } = useUser();
  const auth = FIREBASE_AUTH;

  const [isEditing, setIsEditing] = useState({pseudo: false, email: false, password: false});
  const [newPseudo, setNewPseudo] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState();

  const handleToggleEdit = (field) => {
    if(field == 'password'){
      sendPasswordResetEmail(auth, user.email)
        .then(() => {
          alert("Password reset email sent")
        }).catch((error) => {
          alert(error)
        })
    }
    setIsEditing({...isEditing, [field]: !isEditing[field]});
  }

  const handleSavePress = async (field) => {
    switch(field) {
      case 'pseudo':
        try {
          const firestore = getFirestore();
          const { uid } = user;
          const userDocRef = doc(firestore, "users", uid);
          await updateDoc(userDocRef, { pseudo: newPseudo });
          console.log('Pseudo mis à jour avec succès dans Firebase');
        } catch (error) {
          console.error('Erreur lors de la mise à jour du pseudo dans Firebase', error);
        }
        updateUser({ ...user, pseudo: newPseudo });
        break;
      case 'email':
        break;
      default:
        break;
    }
    setIsEditing({...isEditing, [field]: false});
  }

  return (
    <View
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 91, alignSelf: 'center' }}>Profile</Text>
      <View style={{ alignItems: 'center', marginTop: 30 }}>

        <TouchableOpacity>
          <Image
            source={user.imageURL ? { uri: user.imageURL } : images.defaultProfile}
            style={styles.profilImage}
          />

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setModalVisible(true)}
          >
            <Icon name="camera-outline" size={20} color="#FFB703" />
          </TouchableOpacity>
        </TouchableOpacity>

<Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Icon name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Photo de profil</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => uploadImage(setModalVisible, setImage, user, updateUser)} style={styles.button}>
              <Icon name="camera-outline" size={20} color="#FFB703" />
              <Text>Caméra</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => uploadImage(setModalVisible, setImage, user, updateUser, 'gallery')} style={styles.button}>
              <Icon name="image-outline" size={20} color="#FFB703" />
              <Text>Galerie</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={removeImage} style={styles.button}>
              <Icon name="trash-can-outline" size={20} color="black" />
              <Text>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

        <Cards 
          behaviorType="type1" isEditing={isEditing}
          newData={newPseudo}
          setNewData={setNewPseudo}
          type="pseudo"
          onPressProps={handleToggleEdit}
          setIsEditing={setIsEditing}
          handleSavePress={handleSavePress}
          name ={user.pseudo}
        />

        <Cards 
          behaviorType="type1" isEditing={isEditing}
          newData={newEmail}
          setNewData={setNewEmail}
          type="email"
          onPressProps={handleToggleEdit}
          setIsEditing={setIsEditing}
          handleSavePress={handleSavePress}
          name ={user.email}
        />

        <Cards 
          behaviorType="type2"isEditing={isEditing}
          type="password"
          onPressProps={handleToggleEdit}
          name ="Changer de mot de passe"
        />

      </View>

      <TouchableOpacity
        style={[styles.buttonL, styles.registerButton]}
        onPress={() => FIREBASE_AUTH.signOut()}
      >
        <Text style={styles.userName}>Logout</Text>
      </TouchableOpacity>

    </View>
  );
};

export default Profil;

const styles = StyleSheet.create({
  profilImage:{
    borderRadius: 75,
    width: 150,
    height:150,
    borderColor: '#f0f0f0',
    borderWidth: 5,
  },

  editButton:{
    backgroundColor:'#f0f0f0',
    borderRadius: 24,
    padding: 8,
    position:'absolute',
    right:5,
    bottom: 5,
  },

  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },

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

  buttonL: {
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

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: 350,
    height: 150,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  button: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 10,
  },

  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
