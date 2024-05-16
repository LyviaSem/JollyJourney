import React, { useState, useLayoutEffect, useCallback } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Image, Platform } from 'react-native'; 
import { collection, addDoc, orderBy, query, getDocs, where } from 'firebase/firestore';
import { firestore } from '../../../FirebaseConfig';
import { GiftedChat } from 'react-native-gifted-chat';
import { useUser } from '../../../context/UserContext';
import { images } from '../../theme/theme';

const Messages = ({ route, navigation: {goBack, navigate}}) => {

  const {group} =route.params

  const { user } = useUser();

  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    const fetchMessages = async () => {
      try {
        const chatCollectionRef = collection(firestore, 'chats'); // Référence à la collection "chats"
        const qWhere = query(chatCollectionRef, where('groupId', '==', group.id)); // Requête pour le filtre where
        const qOrderBy = query(qWhere, orderBy('createdAt', 'desc')); // Requête pour l'ordre orderBy
        const querySnapshot = await getDocs(qOrderBy);

        const loadedMessages = querySnapshot.docs.map(doc => {
          const message = doc.data();
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

    fetchMessages(); // Appel de la fonction
}, []);


  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(firestore, 'chats'), {
      _id,
      createdAt,
      text,
      groupId: group.id,
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
  <TouchableOpacity
    onPress={() => navigate('GroupDetails', {group: group})}
  >
    <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', padding: 10 }}>
      {group.name}
    </Text>
  </TouchableOpacity>
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