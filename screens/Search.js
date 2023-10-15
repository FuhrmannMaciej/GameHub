import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import colors from "../colors";
import { collection, query, where, getDocs } from "firebase/firestore";
import { database } from "../config/firebase";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const usersRef = collection(database, "gamers");
      const q = query(usersRef, where("firstName", "==", searchQuery));
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map((doc) => ({
        userId: doc.id,
        ...doc.data(),
      }));
      setSearchResults(users);
    } catch (error) {
      console.error("Error searching for users: ", error);
    }
  };

  const renderItem = ({ item }) => {
    console.log("Item userId: ", item.userId);
    return (
      <View style={{ height: 70, backgroundColor: colors.lightGray }}>
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => navigation.navigate("UserProfile", { userId: item.userId })}
      >
        <Text style={styles.userName}>{item.firstName + " " + item.lastName}</Text>
      </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search users by name..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      <SafeAreaView style={styles.usersList}>
        <FlatList
          data={searchResults}
          ItemSeparatorComponent={() => (
            <View style={{ height: 5, backgroundColor: colors.gray }} />
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.userId}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>No users found.</Text>
          )}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray,
    flex: 1,
  },
  searchInput: {
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  userItem: {
    padding: 20,
    borderColor: colors.darkGrey,
  },
  userName: {
    fontSize: 16,
    color: colors.darkGrey,
  },
  emptyListText: {
    textAlign: "center",
    margin: 20,
    fontSize: 16,
    color: colors.darkGrey,
  },
  usersList: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
});

export default Search;
