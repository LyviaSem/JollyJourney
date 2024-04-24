import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button } from 'react-native';
import { stylesCards } from '../../style/StyleCards';

const CardChildrenProfil = ({ isEditing, newData, setNewData, type, handleToggleEdit, handleSavePress, name }) => {
    return (
      <>
        {isEditing[type] ? (
          <View>
            <Text>Nouveau {type}</Text>
            <TextInput
              value={newData}
              onChangeText={(text) => setNewData(text)}
            />
            <Button title="Enregistrer" onPress={() => handleSavePress(type)}/>
          </View>
        ) : (
          
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={stylesCards.userInfo}>
                <Text style={stylesCards.userName}>{name}</Text>
              </View>
            </View>
          
        )}
        </>
    );
  };
  
  export default CardChildrenProfil;