import React, {useEffect, useState, useLayoutEffect, useCallback} from 'react';
import { firestore } from '../../../FirebaseConfig';
import { collection, addDoc, orderBy, query, onSnapshot, where, getDocs } from 'firebase/firestore';
import { useUser } from '../../../context/UserContext';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, StatusBar, Image, FlatList} from 'react-native';
import Cards from '../../component/Card/Cards'; 
import { images } from "../../theme/theme";

const Contacts = ({navigation}) => {

  const { user } = useUser();
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserGroups = async () => {
    try {
      const userl = collection(firestore, "members");
      const q = query(userl, where("userId", "==", user.uid));
      const userSnapshot = await getDocs(q);
      if (!userSnapshot.empty) {
        const UserData = userSnapshot.docs.map((doc) => doc.data());

        const groups = UserData.map((user) => user.groupId || []);

        const groupPromises = groups.map(async (groupId) => {
          const groupDocRef = collection(firestore, "groups");
          const q = query(groupDocRef, where("id", "==", groupId));
          const groupDoc = await getDocs(q);
          return groupDoc.docs.map((doc) => doc.data());
        });

        const groupData = await Promise.all(groupPromises);
        const flattenedGroups = groupData.flat();

        setUserGroups(flattenedGroups);
        setLoading(false);
      } else {
        alert("Utilisateur non trouvé.");
      }
    } catch (error) {
      console.error("Error fetching user groups: ", error);
      setLoading(false);
    }
  };

useEffect(() => {
  fetchUserGroups();
}, [user]);

const renderGroupItem = ({ item }) => (
  <Cards behaviorType="type2" name={item.name} image={images.defaultProfile} onPressProps={{ routeName: "Message", additionalProps: { group: item }}}/>
);

  return (
    <View
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#FEF5EE",
        flex: 1,
      }}
    >
      <View style={{ alignItems: 'center', marginTop: 30 }}>
            <FlatList
              data={userGroups}
              keyExtractor={(item) => item.id}
              renderItem={renderGroupItem}
            />
          </View>
    </View>
  )
}

export default Contacts;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    color: "#FFB703",
    marginTop: 10,
    fontSize: 40,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 50,
    flexDirection: "row",
  },
  logo: {
    width: 250,
    height: 150,
    resizeMode: "contain",
  },
  loginButton: {
    backgroundColor: "#6E4B6B",
    borderRadius: 15,
    width: 150,
    height: 70,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  registerButton: {
    backgroundColor: "#6E4B6B",
    borderRadius: 15,
    width: 150,
    height: 70,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  switchButton: {
    margin: 10,
    alignItems: "center",
  },
  switchButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFB703",
    fontWeight: "bold",
  },
});