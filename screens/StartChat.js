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
  ImageBackground,
} from "react-native";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, database, storage } from "../config/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { AntDesign } from "@expo/vector-icons";
import colors from "../colors";

export default function StartChat({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [recentChats, setRecentChats] = useState([]);
  const [avatar, setAvatar] = useState("");

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
    
        const mappedChats = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const participants = doc.data().participants;
            const lastMessage = doc.data().lastMessage;
    
            // Fetch user data for each participant
            const participantNames = await Promise.all(
              participants.map(async (userId) => {
                try {
                  const userDocRef = doc(database, "gamers", userId);
                  const userDocSnap = await getDoc(userDocRef);
    
                  if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    return `${userData.firstName} ${userData.lastName}`;
                  } else {
                    return null;
                  }
                } catch (error) {
                  console.error("Error fetching user data: ", error);
                  return null;
                }
              })
            );
    
            return {
              chatId: doc.id,
              participants: participantNames,
              lastMessage: lastMessage,
            };
          })
        );
    
        setRecentChats(mappedChats);
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

  const fetchAvatar = async (userId) => {
    try {
      const avatarPath = `avatars/${userId}`;
      const storageRef = ref(storage, avatarPath);
      const url = await getDownloadURL(storageRef);
      setAvatar(url);
    } catch (error) {
      setAvatar("");
    }
  };

  useEffect(() => {
    // Fetch avatar for the first chat item
    if (recentChats.length > 0) {
      const userId = recentChats[0].chatId.split('_').find(id => id !== auth.currentUser.uid);
      if (userId) {
        fetchAvatar(userId);
      }
    }
  }, [recentChats]);

  const renderChatListItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Chat", { chatId: item.chatId });
      }}
    >
      <View style={styles.chatListItem}>
        <Text style={styles.userName}>{item.participants[0]}</Text>
        <Text>{item.lastMessage.text}</Text>
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
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
