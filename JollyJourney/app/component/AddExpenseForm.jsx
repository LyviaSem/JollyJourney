
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, Modal, TextInput, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dropdown from './DropDown';

const AddExpenseForm = ({group, isVisible, setIsVisible }) => {

    const [checkedItems, setCheckedItems] = useState({});
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');

    const toggleCheckBox = (itemId) => {
        setCheckedItems(prevState => ({
          ...prevState,
          [itemId]: !prevState[itemId]
        }));
      };
    


return(
    <Modal
        visible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        transparent={true}
    >
        <View style={styles.contentPosition}>
        <View style={styles.modalContent}>
        <TextInput
           placeholder="Titre"
           value={title}
           onChangeText={setTitle}
           style={{ marginBottom: 10, paddingHorizontal: 10, height: 40, borderColor: 'gray', borderWidth: 1 }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <TextInput
              placeholder="Montant"
              value={amount}
              onChangeText={text => setAmount(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              style={{ flex: 1, marginRight: 10, paddingHorizontal: 10, height: 40, borderColor: 'gray', borderWidth: 1 }}
            />
            <Text>Euro</Text>
        </View>
       
        <Dropdown group= {group} />
        <FlatList
            data={group}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    style={{
                      width: 24,
                      height: 24,
                    
                      marginRight: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => toggleCheckBox(item.id)}
                  >
                    <Icon
                      name={checkedItems[item.id] ? 'checkbox-marked' : 'checkbox-blank-outline'}
                      size={24}
                      color={checkedItems[item.id] ? 'green' : 'black'}
                    />
                  </TouchableOpacity>
                  <Text>{item.pseudo}</Text>
                </View>
            )}
        />

        <TouchableOpacity
          onPress={() => setIsVisible(false)}
        >
          <Text> exit</Text>
        </TouchableOpacity>
        </View>
        </View>

      </Modal>
)


}

export default AddExpenseForm;

const styles = StyleSheet.create({

    contentPosition:{
        flex: 1,
        justifyContent: 'flex-end'
    },

    modal: {
        marginBottom: 0
    },
    
    modalContent: {
        height: Dimensions.get('window').height * 0.50,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        marginBottom: 0
    },
})