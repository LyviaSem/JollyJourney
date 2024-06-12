import React, { useState, useLayoutEffect, useCallback } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import {
  collection,
  addDoc,
  orderBy,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { firestore } from "../../../FirebaseConfig";
import { GiftedChat } from "react-native-gifted-chat";
import { useUser } from "../../../context/UserContext";
import { IMAGES } from "../../theme/theme";
import { textStyles } from "../../style/textStyles";

const Messages = ({ route, navigation }) => {
  const { group } = route.params;

  const { user } = useUser();

  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingLeft: 10 }}
        >
          <Image source={IMAGES.planeBtn} style={{ width: 30, height: 25 }} />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("GroupDetails", { group: group })
            }
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Image
              source={
                group.info.imageURL
                  ? { uri: group.info.imageURL }
                  : IMAGES.defaultImage
              }
              style={{
                width: 35,
                height: 35,
                borderRadius: 20,
                marginRight: 10,
              }}
            />
            <Text
              style={{
                fontSize: 18,
                padding: 10,
                ...textStyles.title
              }}
            >
              {group.info.name}
            </Text>
          </TouchableOpacity>
        </>
      ),
      headerTitleAlign: "center",
      headerBackVisible: false,
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const fetchMessages = async () => {
      try {
        const chatCollectionRef = collection(firestore, "chats");
        const qWhere = query(
          chatCollectionRef,
          where("groupId", "==", group.info.id)
        );
        const qOrderBy = query(qWhere, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(qOrderBy);

        const loadedMessages = querySnapshot.docs.map((doc) => {
          const message = doc.data();
          return {
            ...message,
            createdAt: message.createdAt.toDate(),
          };
        });

        setMessages(loadedMessages);
      } catch (error) {
        console.error("Error fetching messages: ", error);
      }
    };

    fetchMessages();
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(firestore, "chats"), {
      _id,
      createdAt,
      text,
      groupId: group.info.id,
      user,
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        renderUsernameOnMessage={true}
        user={{
          _id: user.email,
          avatar: user.imageURL || IMAGES.defaultProfile,
          name: user.pseudo,
        }}
      />
    </View>
  );
};

export default Messages;
