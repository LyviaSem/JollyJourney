import { View, Text, StatusBar } from "react-native";
import React from "react";

const Expenses = ({ route, navigation }) => {
  const { members } = route.params;
  console.log(members);

  return (
    <View
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,
      }}
    >
      <Text>Expenses</Text>
    </View>
  );
};

export default Expenses;
