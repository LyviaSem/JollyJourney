import { View, Text, TextInput, TouchableOpacity, Image, Modal, StyleSheet, StatusBar, Platform } from 'react-native';
import React, { useState } from 'react';
import { firestore } from '../../../FirebaseConfig';
import { collection, addDoc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { images } from '../../theme/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import PicModal from '../../component/PicModal';
import { uploadImage, removeImage } from "../../services/imageService";
import { useUser } from '../../../context/UserContext';

const GroupInfo = ({route, navigation}) => {

    const {creatorId} = route.params;

    const [nomDuGroupe, setNomDuGroupe] = useState("");
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [imageUri, setImageUri] = useState();
    const { user, selectedUsers, setSelectedUsers } = useUser();

    const isAdmin = (member) => {
      return member.uid === user.uid
    }

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
            const membreCollection = collection(firestore, 'groups', groupId, 'members');
    
            await addDoc(membreCollection, {
              userId: member.uid,
              role: isAdmin(member) ? "admin" : "member"
            });

            memberData.push({
              userId: member.uid,
              role: isAdmin(member) ? "admin" : "member"
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
            navigation.navigate('GroupTrips', { group: groupObject});
          } 
          
          
        if (onGroupCreatedCallback) {
          onGroupCreatedCallback();
        }
    
        } catch (error) {
          console.error("Erreur lors de la création du groupe : ", error);
        }
  };

  return (
    <View
        style={
            {paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,}
        }
    >
        <View 
         style={{ flex: 1, alignItems: "center" }}
        >
          <View style={styles.groupInfo}>
          <TouchableOpacity 
          style={styles.profilImageContainer}
          onPress={() => setModalVisible(true)}
          >
          <Image
            source={imageUri? { uri: imageUri } : images.defaultProfile}
            style={styles.profilImage}
          />

            </TouchableOpacity>

            <TextInput
              style={{ paddingHorizontal: 10 }}
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
        style={[styles.button, styles.Button, styles.arrowButton]}
        onPress={() => {
            createGroup();
        }}
      >
        <Icon name="check" size={24} color="#fff" />
      </TouchableOpacity>

            <View style={{ flexDirection: "row", justifyContent: "space-between", gap:10 }}>

              <TouchableOpacity
                style={{ padding: 10, borderRadius: 5, width: "45%", alignItems: "center", backgroundColor: "red" }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Annuler</Text>
              </TouchableOpacity>
            </View>
          {/* </View> */}
        </View>

        <Modal 
        visible={errorModalVisible} transparent={true} backdropColor="none"
      >
        <View style={styles.modalContainerError}>
          <View  style={styles.modalContentError}>
            <Text style={styles.modalErrorText}>{errorMessage}</Text>
          </View>
        </View>
      </Modal>

    </View>
  )
}

export default GroupInfo

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
    profilImage:{
        borderRadius: 75,
        width: 50,
        height:50,
        borderColor: 'black',
        borderWidth: 1,
    },
    groupInfo:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        height: 70,
        borderColor: "gray", 
        borderWidth: 1,
        borderRadius: 5,
        width: 380,
        paddingHorizontal: 10,
        marginBottom: 10
    }
  });