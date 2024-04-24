import React, {useEffect, useState, useLayoutEffect, useCallback} from 'react';
import { Text, TouchableOpacity } from 'react-native'; 
import { collection, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../../FirebaseConfig';
import { GiftedChat } from 'react-native-gifted-chat';
import { useUser } from '../../../context/UserContext';

const Messages = ({navigation}) => {

  const { user } = useUser();

  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    const collectionRef = collection(firestore, 'chats');
    const q = query(collectionRef, orderBy('createAt', 'desc'));

    const unsubscribe = onSnapshot(q, snapshot => {
      console.log('snapshot');
      setMessages(
        snapshot.docs.map(doc => ({
          _id: doc.id,
          createAt: doc.data().createAt,
          text: doc.data().text,
          user: doc.data().user
        }))
      )
    });
    return () => unsubscribe();
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

    const { _id, createdAt, text, user } = messages[0];
    console.log(messages[0])
    addDoc(collection(firestore, 'chats'), {
      _id,
      createdAt,
      text,
      user
    });
  }, []);

  return (
    <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: user.email
        }}
      />
  )
}

export default Messages;