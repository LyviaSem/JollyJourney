import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateDoc, doc } from 'firebase/firestore';
import { storage, firestore } from '../../FirebaseConfig';


export const uploadImage = async (setModalVisible, setImage, user, updateUser, mode) => {
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
           await uploadImageFirestorage(result.assets[0].uri, setImage, setModalVisible, user, updateUser,);
        }
    } catch (error) {
        alert("Error uploading image: " + error.message);
        setModalVisible(false);
    }
};

const uploadImageFirestorage = async (uri, setImage, setModalVisible, user, updateUser) => {
    try {
        if (uri) {
            const imageName = uri.substring(uri.lastIndexOf('/') + 1);
            const response = await fetch(uri);
            const blob = await response.blob();
            const fileRef = ref(storage, `images/${imageName}`);
            await uploadBytes(fileRef, blob);
            const downloadURL = await getDownloadURL(fileRef);
            
            const userDocRef = doc(firestore, 'users', user.uid);
            await updateDoc(userDocRef, { imageURL: downloadURL });

            updateUser({ ...user, imageURL: downloadURL });

            console.log(user)

            setModalVisible(false);
        }
    } catch (error) {
        console.error("Une erreur est survenue :", error);
        setModalVisible(false);
    }
};

export const saveImage = async (image, setImage, setModalVisible) => {
    try {
        setImage(image);
        setModalVisible(false);
    } catch (error) {
        throw (error);
    }
};

export const removeImage = async (setImage, setModalVisible) => {
    try {
        saveImage(null, setImage, setModalVisible);
    } catch ({ message }) {
        alert(message);
    }
};