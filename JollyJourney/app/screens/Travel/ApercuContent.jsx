import { View, Text, TextInput, Button, TouchableOpacity, Animated } from "react-native";
import React, { useState, useRef } from "react";
import { stylesApercuContent } from "../../style/StyleApercuContent";
import { AntDesign } from '@expo/vector-icons';


const ApercuContent = ({ route, navigation }) => {

  const [inputs, setInputs] = useState([{ title: 'Title', value: '' }]);

  const [showOptions, setShowOptions] = useState(false); // État pour contrôler l'affichage des options
  const spinValue = useRef(new Animated.Value(0)).current; // Référence pour l'animation

  const toggleOptions = () => {
    // Fonction pour basculer l'affichage des options et lancer l'animation
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
    setInputs([...inputs, { title: "Title", value: "" }]);
  };

  return (
    <View>
      {inputs.map((input, index) => (
        <View key={index} style={stylesApercuContent.inputContainer}>
          <TextInput
            style={stylesApercuContent.titleInput} // Remove border for the first TextInput
            placeholder="Title"
            value={input.title}
            onChangeText={(text) => handleTitleChange(text, index)}
          />
          <TextInput
            style={stylesApercuContent.input}
            placeholder="Value"
            value={input.value}
            onChangeText={(text) => handleInputChange(text, index)}
          />
        </View>
      ))}
      <TouchableOpacity style={stylesApercuContent.addButton} onPress={toggleOptions}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <AntDesign name={showOptions ? "minus" : "plus"} size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
      {/* Affichage des options */}
      {showOptions && (
        <View style={stylesApercuContent.optionsContainer}>
          {/* Ajoutez vos options ici */}
          <TouchableOpacity style={stylesApercuContent.option}>
            <Text style={stylesApercuContent.optionText}>Option 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={stylesApercuContent.option}>
            <Text style={stylesApercuContent.optionText}>Nouvelle liste</Text>
          </TouchableOpacity>
          {/* Ajoutez autant d'options que nécessaire */}
        </View>
      )}
    </View>
  );
};

export default ApercuContent;