import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';
import { TouchableOpacity, View, TextInput, FlatList, Text } from 'react-native';
import { GiftedChat, Avatar } from 'react-native-gifted-chat'; // Make sure to import Avatar
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  where,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, database, storage } from '../config/firebase'; // Import storage
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';

export default function StartChat({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [recentChats, setRecentChats] = useState([]);

  const onSignOut = () => {
    signOut(auth).catch((error) => console.log('Error logging out: ', error));
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
    const collectionRef = collection(database, 'chats');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setRecentChats(
        querySnapshot.docs.map((doc) => ({
          chatId: doc.id,
          participants: doc.data().participants,
          lastMessage: doc.data().lastMessage,
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  const onSend = useCallback(
    async (messages = []) => {
      const { _id, createdAt, text, user } = messages[0];
      const chatId = messages[0].chatId || createChatId(auth.currentUser.uid, user._id);

      try {
        // Add the message to the messages collection
        await addDoc(collection(database, 'messages'), {
          _id,
          createdAt,
          text,
          user,
          chatId,
        });

        // Update or create the chat in the chats collection
        await updateOrCreateChat(chatId, messages[0]);
      } catch (error) {
        console.error('Error sending message: ', error);
      }
    },
    []
  );

  const createChatId = (userId1, userId2) => {
    // A function to create a unique chatId based on user ids
    const sortedIds = [userId1, userId2].sort();
    return `${sortedIds[0]}_${sortedIds[1]}`;
  };

  const updateOrCreateChat = async (chatId, message) => {
    try {
      const chatRef = collection(database, 'chats').doc(chatId);
      const chatDoc = await chatRef.get();

      if (chatDoc.exists) {
        // Update the existing chat with the new message
        await chatRef.update({
          lastMessage: message,
        });
      } else {
        // Create a new chat
        await addDoc(collection(database, 'chats'), {
          chatId,
          createdAt: message.createdAt,
          participants: [auth.currentUser.uid, message.user._id],
          lastMessage: message,
        });
      }
    } catch (error) {
      console.error('Error updating or creating chat: ', error);
    }
  };

  const renderChatListItem = ({ item }) => (
  <TouchableOpacity
    onPress={() => {
      // Navigate to the chat screen with the selected participant
      navigation.navigate('Chat', { chatId: item.chatId });
    }}
  >
    <View style={{ padding: 16 }}>
      <Avatar
        uri={item.lastMessage.user?.avatar}
        size={40} // Adjust the size according to your design
      />
      <Text>{item.lastMessage.user?._id}</Text>
      <Text>{item.lastMessage.text}</Text>
    </View>
  </TouchableOpacity>
);  

  return (
    <View style={{ flex: 1 }}>
      {/* Search bar */}
      <TextInput
        placeholder="Search for a user..."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      {/* Recent Chats List */}
      <FlatList
        data={recentChats}
        renderItem={renderChatListItem}
        keyExtractor={(item) => item.chatId}
      />

      {/* GiftedChat component */}
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: auth?.currentUser?.uid,
          avatar: 'https://i.pravatar.cc/300', // Default avatar if user avatar is not available
        }}
        renderAvatar={(props) => (
          <Avatar
            {...props}
            uri={props.currentMessage.user.avatar}
            size={40} // Adjust the size according to your design
          />
        )}
      />
    </View>
  );
}
