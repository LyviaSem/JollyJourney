import React from "react";
import { useUser } from "../../../context/UserContext";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  Platform,
  ActivityIndicator
} from "react-native";
import Cards from "../../component/Card/Cards";
import { IMAGES } from "../../theme/theme";
import { COLORS } from "../../theme/theme";
import { textStyles } from "../../style/textStyles";

const Contacts = ({}) => {
  const { userGroups, loadingGroups } = useUser();

  if (loadingGroups) {
    return (
      <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <ActivityIndicator size="large" color={COLORS.purple} />
    </View>
    );
  }

  const renderGroupItem = ({ item }) => (
    <Cards
      behaviorType="type2"
      name={item.info.name}
      image={item.info.imageURL ? { uri: item.info.imageURL } : IMAGES.defaultProfile} 
      onPressProps={{ routeName: "Message", additionalProps: { group: item } }}
    />
  );

  return (
    <View
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,
      }}
    >
      <Text
        style={{
          ...textStyles.title,
          fontSize: 20,
          marginTop: 91,
          alignSelf: "center",
        }}
      >
        Mes contacts
      </Text>
      <View style={{ alignItems: "center", marginTop: 50 }}>
        <FlatList
          data={userGroups}
          keyExtractor={(item) => item.info.id}
          renderItem={renderGroupItem}
        />
      </View>
    </View>
  );
};

export default Contacts;
