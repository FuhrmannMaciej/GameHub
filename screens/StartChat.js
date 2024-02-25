import React, { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { TouchableOpacity, View, TextInput, FlatList, Text, StyleSheet, ImageBackground } from "react-native";
import { collection, addDoc, orderBy, query, onSnapshot, getDocs, doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, database, storage } from "../config/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { AntDesign } from "@expo/vector-icons";
import colors from "../colors";

export default function StartChat({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [recentChats, setRecentChats] = useState([]);

  const onSignOut = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 10 }} onPress={onSignOut}>
          <AntDesign name="logout" size={24} color={colors.gray} style={{ marginRight: 10 }} />
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
          querySnapshot.docs.map(async (document) => {
            const participants = document.data().participants;
            const lastMessage = document.data().lastMessage;

            // Fetch user data for each participant
            const participantData = await Promise.all(
              participants.map(async (userId) => {
                try {
                  const userDocRef = doc(database, "gamers", userId);
                  const userDocSnap = await getDoc(userDocRef);
                  
                  if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    const avatar = await fetchAvatar(userId);
                    return { userId, userName: `${userData.firstName} ${userData.lastName}`, avatar };
                  } else {
                    return null;
                  }
                } catch (error) {
                  console.error("Error fetching user data: ", error);
                  return null;
                }
              })
            );
            const recipient = participantData.find((participant) => participant.userId !== auth.currentUser.uid);
            return {
              chatId: document.id,
              participants: participantData,
              lastMessage: lastMessage,
              recipient: recipient,
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
  }, []); // Empty dependency array to run the effect only once

  const onSend = useCallback(async (messages = []) => {
    const { _id, createdAt, text, user } = messages[0];
    const chatId = messages[0].chatId || createChatId(auth.currentUser.uid, user._id);

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
      return url;
    } catch (error) {
      return "";
    }
  };

  const renderChatListItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Chat", { chatId: item.chatId, participants: item.participants , recipient: item.recipient});
      }}
    >
      <View style={styles.chatListItem}>
        <ImageBackground
          source={{ uri: item.recipient.avatar || 'default_avatar_url' }}
          style={styles.avatarImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.userName}>
            {item.recipient.userName}
          </Text>
          {/* <Text style={styles.lastMessage}>{item.lastMessage.text}</Text> */}
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
    fontSize: 16,
    color: colors.black,
  },
  lastMessage: {
    color: colors.gray,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});
