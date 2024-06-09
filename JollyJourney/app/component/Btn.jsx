import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../theme/theme";

const Btn = ({
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
    backgroundColor: COLORS.purple,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
    padding: 20,
    marginBottom: 25,
  },
  buttonText: {
    color: COLORS.white,
  },
  iconContainer: {
    marginRight: 10,
  },
});

export default Btn;
