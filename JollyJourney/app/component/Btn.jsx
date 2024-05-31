import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const CustomButton = ({
  name,
  action,
  iconName,
  iconSize = 24,
  iconColor = "#fff",
  buttonStyle,
  textStyle,
}) => {
  return (
    <TouchableOpacity style={[styles.button, buttonStyle]} onPress={action}>
      {iconName && (
        <View style={styles.iconContainer}>
          <Icon name={iconName} size={iconSize} color={iconColor} />
        </View>
      )}
      <Text style={[styles.buttonText, textStyle]}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#6E4B6B",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
    padding: 20,
    marginBottom: 25,
  },
  buttonText: {
    color: "#fff",
  },
  iconContainer: {
    marginRight: 10,
  },
});

export default CustomButton;
