import React, { useState, useLayoutEffect, useCallback } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Image, Platform } from 'react-native'; 
import { collection, addDoc, orderBy, query, getDocs, where } from 'firebase/firestore';
import { firestore } from '../../../FirebaseConfig';
import { GiftedChat } from 'react-native-gifted-chat';
import { useUser } from '../../../context/UserContext';
import { images } from '../../theme/theme';

const Messages = ({ route, navigation}) => {

  const {group} =route.params

  const { user } = useUser();

  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () =>(
        <TouchableOpacity
          onPress={() => navigation.navigate('GroupDetails', {group: group})}
        >
          <View
            style={{flexDirection: 'row'}}
          >
          <Image
            source={group.info.imageURL}
            style={{ width: 20, height: 20 }} 
          />
          <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', padding: 10 }}>
            {group.info.name}
          </Text>
          </View>
        </TouchableOpacity>
      ),
      // headerLeft: () => (
      //   <TouchableOpacity 
      //     onPress={() => navigation.goBack()}
      //     // style={{ top: 20, left: 20 }}
      //   >
      //     <Image
      //       source={images.planeBtn}
      //       style={{ width: 40, height: 34 }} 
      //     />
      //   </TouchableOpacity>
      // ),
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const fetchMessages = async () => {
      try {
        const chatCollectionRef = collection(firestore, 'chats'); 
        const qWhere = query(chatCollectionRef, where('groupId', '==', group.info.id)); 
        const qOrderBy = query(qWhere, orderBy('createdAt', 'desc')); 
        const querySnapshot = await getDocs(qOrderBy);

        const loadedMessages = querySnapshot.docs.map(doc => {
          const message = doc.data();
          return {
            ...message,
            createdAt: message.createdAt.toDate()
          };
        });

        setMessages(loadedMessages);
      } catch (error) {
        console.error('Error fetching messages: ', error);
      }
    };

    fetchMessages();
}, []);


  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(firestore, 'chats'), {
      _id,
      createdAt,
      text,
      groupId: group.info.id,
      user
    });
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}>
      {/* <View style={{ flexDirection: 'row', marginTop: 20 }}>
  <TouchableOpacity 
    onPress={() => navigation.goBack()}
    style={{ top: 20, left: 20 }}
  >
    <Image
      source={images.planeBtn}
      style={{ width: 40, height: 34 }} 
    />
  </TouchableOpacity>
  <TouchableOpacity
    onPress={() => navigation.navigate('GroupDetails', {group: group})}
  >
    <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', padding: 10 }}>
      {group.info.name}
    </Text>
  </TouchableOpacity>
</View> */}
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        renderUsernameOnMessage = {true}
        user={{
          _id: user.email,
          avatar: user.imageURL || images.defaultProfile,
          name: user.pseudo
        }}
      />
    </View>
  )
}

export default Messages;