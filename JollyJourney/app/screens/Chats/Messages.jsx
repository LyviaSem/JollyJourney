import React, { useState, useLayoutEffect, useCallback } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Image } from 'react-native'; 
import { collection, addDoc, orderBy, query, onSnapshot , getDocs} from 'firebase/firestore';
import { firestore } from '../../../FirebaseConfig';
import { GiftedChat } from 'react-native-gifted-chat';
import { useUser } from '../../../context/UserContext';
import { images } from '../../theme/theme';

const Messages = ({ route, navigation: {goBack}}) => {

  const {group} =route.params

  const { user } = useUser();

  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    const fetchMessages = async () => {
      try {
        const chatCollectionRef = collection(firestore, 'groups', group.id, 'chats');
        const q = query(chatCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const loadedMessages = querySnapshot.docs.map(doc => {
          const message = doc.data();
          console.log(doc.data().createdAt.toDate())
          return {
            ...message,
            createdAt: message.createdAt.toDate() // Convertir la date Firestore en objet Date JavaScript
          };
        });

        setMessages(loadedMessages);
      } catch (error) {
        console.error('Error fetching messages: ', error);
      }
    };

    fetchMessages();

    // Unsubscribe function not needed here since we're fetching initial messages only once

  }, []);

  // useLayoutEffect(() => {
  //   const collectionRef = collection(firestore, 'chats');
  //   const q = query(collectionRef, orderBy('createAt', 'desc'));

  //   const unsubscribe = onSnapshot(q, snapshot => {
  //     console.log(snapshot);
  //     setMessages(
  //       snapshot.docs.map(doc => ({
  //         _id: doc.id,
  //         createAt: doc.data().createAt,
  //         text: doc.data().text,
  //         user: doc.data().user
  //       }))
  //     )
  //   });
  //   return () => unsubscribe();
  // }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(firestore, 'groups', group.id, 'chats'), {
      _id,
      createdAt,
      text,
      user
    });
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}>
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
  <TouchableOpacity 
    onPress={() => goBack()}
    style={{ top: 20, left: 20 }}
  >
    <Image
      source={images.planeBtn}
      style={{ width: 40, height: 34 }} // Assurez-vous de définir les dimensions de l'image
    />
  </TouchableOpacity>
  <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', padding: 10 }}>
    {group.name}
  </Text>
</View>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: user.email,
          avatar: user.imageURL ? user.imageURL : images.defaultProfile
        }}
      />
    </View>
  )
}

export default Messages;