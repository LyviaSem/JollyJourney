import React, {useEffect, useState, useLayoutEffect, useCallback} from 'react';
import { Text, TouchableOpacity } from 'react-native'; 
import { collection, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { GiftedChat } from 'react-native-gifted-chat';

const Messages = ({navigation}) => {

  const [messages, setMessages] = useState([])

  return (
    <GiftedChat
        messages={messages}
        onSend={newMessage => setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage))}
      />
  )
}

export default Messages;