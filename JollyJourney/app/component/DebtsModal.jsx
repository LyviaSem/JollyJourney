import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Modal, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getUserInfo } from "../services/firebaseFunction";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { textStyles } from "../style/textStyles";


const DebtsModal = ({ visible, setDebtsModalVisible, debts }) => {
  const [debtData, setDebtData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDebts = async () => {
      setLoading(true);
      let debtList = [];
      for (const debtorId in debts) {
        for (const creditorId in debts[debtorId]) {
          const debtorInfo = await getUserInfo(debtorId);
          const creditorInfo = await getUserInfo(creditorId);
          debtList.push({
            debtor: debtorInfo.pseudo,
            creditor: creditorInfo.pseudo,
            amount: debts[debtorId][creditorId],
          });
        }
      }
      setDebtData(debtList);
      setLoading(false);
    };

    if (visible) {
      fetchDebts();
    }
  }, [visible, debts]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={textStyles.text}>
        <Text style={textStyles.subTitle}>{item.debtor}</Text> doit {item.amount} à <Text style={textStyles.subTitle}>{item.creditor}</Text>
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <TouchableOpacity 
        style={{ position: 'absolute',
        top: 10,
        right: 10,}}
        onPress={() => setDebtsModalVisible(false)}>
              <Icon name={"close"} size={24} color={"gray"} />
            </TouchableOpacity>
          <Text style={styles.title}>Dettes</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={debtData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    ...textStyles.subTitle
  },
  item: {
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 5,
    width: '100%',
  },
});

export default DebtsModal;
