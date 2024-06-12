import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button } from 'react-native';
import { cardsStyle } from '../../style/cardsStyle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


const CardChildrenProfil = ({ isEditing, newData, setNewData, type, setIsEditing, handleSavePress, name }) => {
    return (
      <>
        {isEditing[type] ? (
          <View>
            <Text>Nouveau {type}</Text>
            <TextInput
              value={newData}
              onChangeText={(text) => setNewData(text)}
            />
          </View>
        ) : (
          
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={cardsStyle.userInfo}>
                <Text style={cardsStyle.userName}>{name}</Text>
              </View>
            </View>
          
        )}
        </>
    );
  };
  
  export default CardChildrenProfil;