import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../FirebaseConfig';


export const uploadImage = async (setModalVisible, setImage, mode) => {
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
           await uploadImageFirestorage(result.assets[0].uri, setImage, setModalVisible);
        }
    } catch (error) {
        alert("Error uploading image: " + error.message);
        setModalVisible(false);
    }
};

const uploadImageFirestorage = async (uri, setImage, setModalVisible) => {
    try {
        if (uri) {
            const imageName = uri.substring(uri.lastIndexOf('/') + 1);
            const response = await fetch(uri);
            const blob = await response.blob();
            const fileRef = ref(storage, `images/${imageName}`);
            await uploadBytes(fileRef, blob);
            const downloadURL = await getDownloadURL(fileRef);
            console.log("succes");
            //setImage(uri)
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