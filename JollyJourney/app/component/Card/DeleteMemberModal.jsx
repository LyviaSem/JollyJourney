import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import Btn from "../Btn";

const CustomModal = ({ visible, onClose, message, onConfirm }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text>{message}</Text>
          <View style={{flexDirection:"row", gap:20, marginTop: 30 }}>
            <Btn name="Oui" action={onConfirm} buttonStyle={{ paddingHorizontal: 30 }} />
            <Btn
              name="Non"
              action={onClose}
              buttonStyle={{ paddingHorizontal: 30 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
});

export default CustomModal;
