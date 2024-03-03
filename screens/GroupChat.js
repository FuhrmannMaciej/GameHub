import React, { useState, useLayoutEffect, useCallback, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, orderBy, query, onSnapshot, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import colors from '../colors';
import EntypoIcon from '../components/EntypoIcon';

export default function GroupChat({ navigation, route }) {
  const [messages, setMessages] = useState([]);
  const groupDetails = route.params.groupDetails;

  const onSignOut = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginLeft: 10, flexDirection: 'row' }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Groups')}
          >
            <EntypoIcon name="arrow-long-left" color={colors.lightGray} />
          </TouchableOpacity>
          <Text style={styles.headerText}>
            Group Chat: {groupDetails.groupName}
          </Text>
        </View>
      ),
    });
  }, [navigation, route]);

  useLayoutEffect(() => {

    const collectionRef = collection(database, 'groupChat');

    const groupIdQuery = query(collectionRef, where('groupId', '==', groupDetails.groupId));

    const orderedQuery = query(groupIdQuery, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(orderedQuery, querySnapshot => {
      setMessages(
        querySnapshot.docs.map(doc => ({
          _id: doc.data()._id,
          groupId: doc.data().groupId,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });

    return () => unsubscribe();
  }, [route]);

  const onSend = useCallback(async newMessages => {
    const sentMessage = newMessages[0];

    try {
      await addDoc(collection(database, 'groupChat'), {
        _id: sentMessage._id,
        groupId: groupDetails.groupId,
        createdAt: sentMessage.createdAt,
        text: sentMessage.text,
        user: sentMessage.user,
      });
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  }, [route]);

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
        avatar: "",
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
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.lightGray,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
  },
});
