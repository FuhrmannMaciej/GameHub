import React, { useState, useLayoutEffect, useCallback, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';

export default function Chat({ navigation, route }) {
  const [messages, setMessages] = useState([]);

  const onSignOut = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={onSignOut}
        >
          <AntDesign name="logout" size={24} color={colors.gray} style={{ marginRight: 10 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const { chatId } = route.params; // Access params directly from route

    const collectionRef = collection(database, 'messages');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, querySnapshot => {
      setMessages(
        querySnapshot.docs.map(doc => ({
          _id: doc.data()._id,
          chatId: doc.data().chatId,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });

    return () => unsubscribe();
  }, [route]);

  const onSend = useCallback(async newMessages => {
    const sentMessage = newMessages[0]; // rename to sentMessage

    try {
      await addDoc(collection(database, 'messages'), {
        _id: sentMessage._id,
        chatId: route.params.chatId,
        createdAt: sentMessage.createdAt,
        text: sentMessage.text,
        user: sentMessage.user,
      });
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  }, []);

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      onSend={sentMessages => onSend(sentMessages)}
      messagesContainerStyle={{
        backgroundColor: '#fff',
      }}
      textInputStyle={{
        backgroundColor: '#fff',
        borderRadius: 20,
      }}
      user={{
        _id: auth?.currentUser?.uid,
        avatar: route.params.recipient.avatar,
      }}
    />
  );
}