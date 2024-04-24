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
import placeholder from '../../assets/utilisateur.png';
import { uploadImage, removeImage } from "../services/imageService";
import Cards from "../component/Card/Cards";


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
      <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 91, alignSelf: 'center' }}>Profil</Text>
      <View style={{ alignItems: 'center', marginTop: 30 }}>
        
        <View style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={image ? { uri: image } : placeholder}
                  style={styles.profileImage}
                />
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
              >
            <Image
              source={require("../../assets/avion-papier-retour.png")}
              style={[styles.backButton]}
            />
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
        >
          <View style={styles.modalios}>
            <TouchableOpacity onPress={() => uploadImage(setModalVisible, setImage)}>
              <Text>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => uploadImage(setModalVisible, setImage, 'gallery')}>
              <Text>Gallerie</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => removeImage(setImage, setModalVisible)}>
              <Text>Annuler</Text>
            </TouchableOpacity>

          </View>
        </Modal>

        <Cards 
          behaviorType="type1" isEditing={isEditing}
          newData={newPseudo}
          setNewData={setNewPseudo}
          type="pseudo"
          onPressProps={handleToggleEdit}
          handleSavePress={handleSavePress}
          name ={user.pseudo}
        />

        <Cards 
          behaviorType="type1" isEditing={isEditing}
          newData={newEmail}
          setNewData={setNewEmail}
          type="email"
          onPressProps={handleToggleEdit}
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
        style={[styles.button, styles.registerButton]}
        onPress={() => FIREBASE_AUTH.signOut()}
      >
        <Text style={styles.userName}>Logout</Text>
      </TouchableOpacity>

    </View>
  );
};

export default Profil;

const styles = StyleSheet.create({
  modalios:{
    marginTop: 100,
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
    ,
  },
});
