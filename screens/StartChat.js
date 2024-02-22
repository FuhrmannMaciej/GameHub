import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
} from "react-native";
import { GiftedChat, Avatar } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, database } from "../config/firebase";
import { AntDesign } from "@expo/vector-icons";
import colors from "../colors";

export default function StartChat({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [recentChats, setRecentChats] = useState([]);

  const onSignOut = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 10 }} onPress={onSignOut}>
          <AntDesign
            name="logout"
            size={24}
            color={colors.gray}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const collectionRef = collection(database, "chats");
        const q = query(collectionRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        setRecentChats(
          querySnapshot.docs.map((doc) => ({
            chatId: doc.id,
            participants: doc.data().participants,
            lastMessage: doc.data().lastMessage,
          }))
        );
      } catch (error) {
        console.error("Error fetching chats: ", error);
      }
    };

    const unsubscribe = onSnapshot(collection(database, "chats"), fetchChats);

    return () => {
      unsubscribe();
    };
  }, []);

  const onSend = useCallback(async (messages = []) => {
    const { _id, createdAt, text, user } = messages[0];
    const chatId =
      messages[0].chatId || createChatId(auth.currentUser.uid, user._id);

    try {
      await addDoc(collection(database, "messages"), {
        _id,
        createdAt,
        text,
        user,
        chatId,
      });

      await updateOrCreateChat(chatId, messages[0]);
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  }, []);

  const createChatId = (userId1, userId2) => {
    const sortedIds = [userId1, userId2].sort();
    return `${sortedIds[0]}_${sortedIds[1]}`;
  };

  const updateOrCreateChat = async (chatId, message) => {
    try {
      const chatRef = collection(database, "chats").doc(chatId);
      const chatDoc = await chatRef.get();

      if (chatDoc.exists) {
        await chatRef.update({
          lastMessage: message,
        });
      } else {
        await addDoc(collection(database, "chats"), {
          chatId,
          createdAt: message.createdAt,
          participants: [auth.currentUser.uid, message.user._id],
          lastMessage: message,
        });
      }
    } catch (error) {
      console.error("Error updating or creating chat: ", error);
    }
  };

  const renderChatListItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Chat", { chatId: item.chatId });
      }}
    >
      <View style={styles.chatListItem}>
        <Avatar
          uri={item.lastMessage.user?.avatar}
          size={40}
        />
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{item.lastMessage.user?._id}</Text>
          <Text>{item.lastMessage.text}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for a user..."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <FlatList
        style={styles.chatList}
        data={recentChats}
        renderItem={renderChatListItem}
        keyExtractor={(item) => item.chatId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  searchBar: {
    height: 40,
    margin: 10,
    paddingLeft: 10,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  chatList: {
    flex: 1,
  },
  chatListItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  textContainer: {
    marginLeft: 10,
  },
  userName: {
    fontWeight: "bold",
  },
});
