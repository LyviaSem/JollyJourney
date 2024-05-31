import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Platform,
  SafeAreaView
} from "react-native";
import { useUser } from "../../../context/UserContext";
import Cards from "../../component/Card/Cards";
import { images } from "../../theme/theme";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const Groups = ({navigation }) => {

  const { userGroups } = useUser();

  const [loading, setLoading] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderGroupItem = ({ item }) => {
  
    return (
      <Cards 
        behaviorType="type2" 
        name={item.info.name} 
        image={item.info.imageURL ? { uri: item.info.imageURL } : images.defaultProfile} 
        onPressProps={{ routeName: "GroupTrips", additionalProps: {group: item}}}
      />
    );
  };

  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,
      }}
    >
      {userGroups.length > 0 ? (
        <>
          <View>
          <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 91, alignSelf: 'center' }}>Mes groupes</Text>
            <View style={{ position: 'absolute', top: 10, right: 10, padding: 10 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate("GroupSelectMembers")}
              >
                <Icon name={"plus"} size={30} color="black" />
              </TouchableOpacity>
            </View>
            </View>

          <View style={{ alignItems: 'center', marginTop: 30, flex:1 }}>
            <FlatList
              data={userGroups}
              keyExtractor={(item) => item.info.id}
              renderItem={renderGroupItem}
            />
          </View>
        </>
      ) : (
        <View>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 91, alignSelf: 'center' }}>Mes groupes</Text>
        <View style={{ alignItems: "center", }}>
          <TouchableOpacity
            style={[styles.button, styles.Button]}
            onPress={() => navigation.navigate("GroupSelectMembers")}
          >
            <Text style={styles.buttonText}>Créer mon premier groupe</Text>
          </TouchableOpacity>
        </View>
      </View>
      

      )}
    </SafeAreaView>
  );
};

export default Groups;

const styles = StyleSheet.create({

  card: {
    width: 344,
    height: 68,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 30,
    backgroundColor: 'white',
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 10,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
  },
  Button: {
    backgroundColor: "#6E4B6B",
    borderRadius: 15,
    width: 190,
    height: 57,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  backButton: {
    width: 30,
    height: 25
  },
});
