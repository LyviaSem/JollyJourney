import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useUser } from "../../../context/UserContext";
import Cards from "../../component/Card/Cards";
import { IMAGES, COLORS } from "../../theme/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Btn from "../../component/Btn";
import { style } from "../../style/Style";
import { groupsStyles } from "../../style/groupsStyle";

const Groups = ({ navigation }) => {
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

  const renderGroupItem = ({ item }) => {
    return (
      <Cards
        behaviorType="type2"
        name={item.info.name}
        image={
          item.info.imageURL
            ? { uri: item.info.imageURL }
            : IMAGES.defaultProfile
        }
        onPressProps={{
          routeName: "GroupTrips",
          additionalProps: { group: item },
        }}
      />
    );
  };

  return (
    <SafeAreaView style={groupsStyles.container}>
      <Text style={groupsStyles.title}>Mes groupes</Text>
      {userGroups.length > 0 ? (
        <>
          <View style={groupsStyles.addButtonContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("GroupSelectMembers")}
            >
              <Icon name={"plus"} size={30} color={COLORS.purple} />
            </TouchableOpacity>
          </View>

          <View style={groupsStyles.flatlistContainer}>
            <FlatList
              data={userGroups}
              keyExtractor={(item) => item.info.id}
              renderItem={renderGroupItem}
            />
          </View>
        </>
      ) : (
        <View style={groupsStyles.buttonContainer}>
          <View style={{ alignItems: "center" }}>
            <Btn
              name="Créer mon premier groupe"
              action={() => navigation.navigate("GroupSelectMembers")}
              textStyle={style.buttonTextStyle}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Groups;
