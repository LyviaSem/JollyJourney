import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, {useState} from "react";
import { useUser } from "../../context/UserContext";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { sendPasswordResetEmail, updateEmail } from "firebase/auth";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import placeholder from '../../assets/utilisateur.png';

const Profil = () => {
  const { user, updateUser } = useUser();
  const auth = FIREBASE_AUTH;

  const [isEditing, setIsEditing] = useState({pseudo: false, email: false, password: false});
  const [newPseudo, setNewPseudo] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState();

  const handleToogleEdit = (field) => {
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
          // Gérez l'erreur ici, par exemple en affichant un message à l'utilisateur
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

  const uploadImage = async (mode) => {
    try{
      let result = {};
      if(mode === "gallery"){
        await ImagePicker.requestMediaLibraryPermissionsAsync()
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1,1],
          quality: 1,
        })

      }
      else{
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1,1],
          quality: 1,
        });
      }

      if(!result.canceled){
        console.log('ici')
        await saveImage(result.assets[0].uri);
      }
    } catch(error){
      alert("Error uploading image: " + error.message);
      setModalVisible(false);
    }
  }

  const saveImage = async (image) => {
    try{
      setImage(image);
      setModalVisible(false);
    }catch(error){
      throw(error);
    }
  }

  const removeImage = async () => {
    try{
      saveImage(null);
    } catch({message}) {
      alert(message);
    }
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
            <TouchableOpacity onPress={() => uploadImage()}>
              <Text>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => uploadImage('gallery')}>
              <Text>Gallerie</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => removeImage()}>
              <Text>Annuler</Text>
            </TouchableOpacity>

          </View>
        </Modal>

        <View style={styles.card}>
          {isEditing.pseudo ? (
            <View>
              <Text>Nouveau pseudo</Text>
              <TextInput
                value={newPseudo}
                onChangeText={(text) => setNewPseudo(text)}
              />
              <Button title="Enregister" onPress={() => handleSavePress('pseudo')}/>
            </View>
          ) : (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.pseudo}</Text>
                </View>
              </View>
          
              <TouchableOpacity onPress={() => handleToogleEdit('pseudo')}>
                <Image source={require("../../assets/avion-papier-retour.png")} style={[styles.backButton]} />
              </TouchableOpacity>
            </>
          )} 
        </View>

        <View style={styles.card}>
          {isEditing.email ? (
            <View>
              <Text>Nouvel email</Text>
              <TextInput
                value={newEmail}
                onChangeText={(text) => setNewEmail(text)}
              />
              <Button title="Enregister" onPress={() => handleSavePress('email')}/>
            </View>
          ) : (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.email}</Text>
                </View>
              </View>
          
              <TouchableOpacity onPress={() => handleToogleEdit('email')}>
                <Image source={require("../../assets/avion-papier-retour.png")} style={[styles.backButton]} />
              </TouchableOpacity>
            </>
          )} 
        </View>

        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Changer de mot de passe</Text>
            </View>
          </View>
          
          <TouchableOpacity onPress={() => handleToogleEdit('password')}>
            <Image source={require("../../assets/avion-papier-retour.png")} style={[styles.backButton]} />
          </TouchableOpacity> 
        </View>


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
