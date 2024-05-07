import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { stylesModal } from '../style/StyleModal';

const PicModal = ({ modalVisible, setModalVisible, uploadImage, removeImage, updateUser, docId, collection, imageUri }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={stylesModal.centeredView}>
        <View style={stylesModal.modalView}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={stylesModal.closeButton}>
            <Icon name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={stylesModal.modalTitle}>Photo de profil</Text>
          <View style={stylesModal.buttonContainer}>
            <TouchableOpacity onPress={() => uploadImage(setModalVisible, docId, collection, imageUri, collection === 'users' ? updateUser : null)} style={stylesModal.button}>
              <Icon name="camera-outline" size={20} color="#FFB703" />
              <Text>Caméra</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => uploadImage(setModalVisible, docId, collection, imageUri, collection === 'users' ? updateUser : null, 'gallery')} style={stylesModal.button}>
              <Icon name="image-outline" size={20} color="#FFB703" />
              <Text>Galerie</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeImage(user, setModalVisible, updateUser)} style={stylesModal.button}>
              <Icon name="trash-can-outline" size={20} color="black" />
              <Text>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PicModal;
