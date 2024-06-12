import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { overviewStyles } from "../style/overviewStyle";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Input = ({ item, handleElementChange, removeElement }) => {
  return (
    <View>
      <TextInput
        style={overviewStyles.titleInput}
        placeholder={`Title`}
        value={item.label}
        onChangeText={(text) => {
          const updatedElement = { ...item, label: text };
          handleElementChange(updatedElement);
        }}
      />
      <View style={{flexDirection:"row", alignItems:"center", gap:10, }}>
        <TextInput
          style={overviewStyles.input}
          placeholder={`Value`}
          value={item.value}
          onChangeText={(text) => {
            const updatedElement = { ...item, value: text };
            handleElementChange(updatedElement);
          }}
        />
        <TouchableOpacity
          onPress={() => removeElement(item.id)}
        >
          <Icon name="trash-can-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Input;
