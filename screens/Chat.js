import React, { useState, useLayoutEffect, useCallback, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, orderBy, query, onSnapshot, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';
import EntypoIcon from "../components/EntypoIcon";


export default function Chat({ navigation, route }) {
  const [messages, setMessages] = useState([]);

  const onSignOut = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginLeft: 10, flexDirection: "row" }}>
          <TouchableOpacity
          style={styles.backButton}
                onPress={() => navigation.navigate("StartChat")}>
          <EntypoIcon name="arrow-long-left" color={colors.lightGray} />
        </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.lightGray, marginLeft: 20, marginTop: 10, marginBottom: 10, }}>
            Chat with {route.params.recipient.userName}
          </Text>
        </View>
      ),
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const { chatId } = route.params;
  
    const collectionRef = collection(database, 'messages');
  
    const chatIdQuery = query(collectionRef, where('chatId', '==', chatId));
  
    const orderedQuery = query(chatIdQuery, orderBy('createdAt', 'desc'));
  
    const unsubscribe = onSnapshot(orderedQuery, querySnapshot => {
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

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    width: 30,
    height: 30,
},
});