import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateDoc, doc, deleteField } from 'firebase/firestore';
import { storage, firestore } from '../../FirebaseConfig';


export const uploadImage = async (setModalVisible, docId, collection, setImage = null, updateUser, mode) => {
    try {
        let result = {};
        if (mode === "gallery") {
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

        } else {
            await ImagePicker.requestCameraPermissionsAsync();
            result = await ImagePicker.launchCameraAsync({
                cameraType: ImagePicker.CameraType.front,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
        }

        if (!result.canceled) {
            if (collection === "users") {
                await uploadImageFirestorage(result.assets[0].uri, setModalVisible, collection, docId, null, updateUser);
            } else {
                await uploadImageFirestorage(result.assets[0].uri, setModalVisible, collection, docId, setImage);
            }
        }
    } catch (error) {
        alert("Error uploading image: " + error.message);
        setModalVisible(false);
    }
};

const uploadImageFirestorage = async (uri, setModalVisible, collection, docId, setImage, updateUser) => {
    try {
        if (uri && collection) {
            const imageName = uri.substring(uri.lastIndexOf('/') + 1);
            const response = await fetch(uri);
            const blob = await response.blob();
            const fileRef = ref(storage, `${collection}/${imageName}`);
            await uploadBytes(fileRef, blob);
            const downloadURL = await getDownloadURL(fileRef);

            if(docId){
               const docRef = doc(firestore, collection, docId);
               await updateDoc(docRef, { imageURL: downloadURL });

              if(collection === "users" && updateUser){
                updateUser(prevUser => ({
                    ...prevUser,
                    imageURL: downloadURL
                }));
            }

            } else {
              if(setImage){
                setImage(downloadURL)
              }
            } 


            setModalVisible(false);
        }
    } catch (error) {
        console.error("Une erreur est survenue :", error);
        setModalVisible(false);
    }
};

export const removeImage = async (user, setModalVisible, updateUser) => {
    try {
        // Supprimer l'image de Firebase Storage
        await deleteImageFromStorage(user.imageURL);
        
        // Supprimer l'URL de l'image de Firestore
        const userDocRef = doc(firestore, 'users', user.uid);
        await updateDoc(userDocRef, { imageURL: deleteField() });
        
        // Mettre à jour l'état utilisateur localement
        updateUser({ ...user, imageURL: null });

        // Masquer la modal
        setModalVisible(false);
    } catch (error) {
        console.error("Une erreur est survenue lors de la suppression de l'image :", error);
        // Gérer l'erreur, afficher un message d'erreur, etc.
    }
};

const deleteImageFromStorage = async (imageURL) => {
    try {
        const fileName = extractFileName(imageURL);
        
        // Créer une référence au fichier dans Firebase Storage
        const fileRef = ref(storage, `images/${fileName}`);
        
        // Supprimer le fichier de Firebase Storage
        await deleteObject(fileRef);
        
        console.log("Image supprimée de Firebase Storage avec succès");
    } catch (error) {
        throw error;
    }
};

const extractFileName = (url) => {
    const regex = /\/images%2F(.*?\.jpeg)/;
    const match = url.match(regex);
    if (match && match.length > 1) {
        return match[1];
    } else {
        throw new Error('Impossible d\'extraire le nom du fichier de l\'URL.');
    }
};