import { View, Text, TextInput, Button, TouchableOpacity, Animated } from "react-native";
import React, { useState, useRef } from "react";
import { stylesApercuContent } from "../../style/StyleApercuContent";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


const ApercuContent = ({ trip }) => {

  console.log(trip)

  const [inputs, setInputs] = useState([
    { title: 'Logement', value: '' },
    { title: 'Moyen de locomotion', value: '' },
    { title: 'Prix du moyen de locomotion', value: '' }
  ]);

  const [showOptions, setShowOptions] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  const toggleOptions = () => {
    setShowOptions(!showOptions);
    Animated.timing(spinValue, {
      toValue: showOptions ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const handleInputChange = (text, index) => {
    const newInputs = [...inputs];
    newInputs[index].value = text;
    setInputs(newInputs);
  };

  const handleTitleChange = (text, index) => {
    const newInputs = [...inputs];
    newInputs[index].title = text;
    setInputs(newInputs);
  };

  const handleAddInput = () => {
    setInputs([...inputs, { title: "New Item", value: "" }]);
  };

  const renderOptions = () => {
    return (
      <View style={stylesApercuContent.optionsContainer}>
        <TouchableOpacity style={stylesApercuContent.option}>
          <Text style={stylesApercuContent.optionText}>Option 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={stylesApercuContent.option}>
          <Text style={stylesApercuContent.optionText}>Nouvelle liste</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
       <Text>Date du voyage: {trip.dateDebut} à {trip.dateFin}</Text>
        <Text>Destination: {trip.nom}</Text>
      {inputs.map((input, index) => (
        <View key={index} style={stylesApercuContent.inputContainer}>
          {/* <TextInput
            style={stylesApercuContent.titleInput}
            placeholder="Ajouter un titre"
            value={input.title}
            onChangeText={(text) => handleTitleChange(text, index)}
          />
          <TextInput
            style={stylesApercuContent.input}
            placeholder="Value"
            value={input.value}
            onChangeText={(text) => handleInputChange(text, index)}
          /> */}
        </View>
      ))}
      <TouchableOpacity style={stylesApercuContent.addButton} onPress={toggleOptions}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Icon name={"plus"} size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
      {showOptions && renderOptions()}
    </View>
  );
};

export default ApercuContent;