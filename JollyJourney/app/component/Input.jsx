import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { stylesApercuContent } from '../style/StyleApercuContent';

const Input = ({ item, handleElementChange }) => {

    
    return (
        <View>
            <TextInput
                style={stylesApercuContent.titleInput}
                placeholder={`Title`}
                value={item.label}
                onChangeText={(text) => {
                    const updatedElement = { ...item, label: text };
                    handleElementChange(updatedElement);
                }}
            />
            <TextInput
                style={stylesApercuContent.input}
                placeholder={`Value`}
                value={item.value}
                onChangeText={(text) => {
                    const updatedElement = { ...item, value: text };
                    handleElementChange(updatedElement);
                }}
            />
        </View>
    );
};

export default Input;
