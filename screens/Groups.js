import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import colors from "../colors";
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  where,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { database } from "../config/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../config/firebase";
import GroupsHeaderLeft from "../components/groupsPage/GroupsHeaderLeft";
import GroupsHeaderRight from "../components/groupsPage/GroupsHeaderRight";
import { useIsFocused } from "@react-navigation/native";

const Groups = ({ navigation }) => {
  const [groups, setGroups] = useState([]);
  const isFocused = useIsFocused();

  const fetchGroups = async () => {
    try {
      const groupsRef = collection(database, "groups");
      const querySnapshot = await getDocs(groupsRef);

      const groupsData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const gameCategoryName = await getCategoryName(data.gameCategory);
          const groupJoinedUsersName = await getUsersName(data.joinedPlayers);
          return {
            groupId: doc.id,
            ...data,
            gameCategoryName,
          };
        })
      );

      setGroups(groupsData);
    } catch (error) {
      console.error("Error fetching groups: ", error);
    }
  };

  const getCategoryName = async (categoryId) => {
    try {
      const categoryRef = collection(database, `gameCategories`);
      const categoryQuerySnapshot = await getDocs(
        query(categoryRef, where("categoryId", "==", categoryId))
      );

      if (!categoryQuerySnapshot.empty) {
        const categoryDoc = categoryQuerySnapshot.docs[0];
        return categoryDoc.data().categoryName || "Unknown Category";
      } else {
        return "Unknown Category";
      }
    } catch (error) {
      console.error("Error fetching category info:", error);
      return "Unknown Category";
    }
  };

  const getUsersName = async (joinedPlayers) => {
    for (let i = 0; i < joinedPlayers.length; i++) {
      const userRef = doc(database, "gamers", joinedPlayers[i]);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      joinedPlayers[i] = `${userData.firstName}`;
    }
    return joinedPlayers;
  };

  useEffect(() => {
    fetchGroups();
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <GroupsHeaderLeft nav={navigation} />,
      headerRight: () => <GroupsHeaderRight nav={navigation} />,
    });
  }, [navigation]);

  const handleGroupJoin = async (groupId) => {
    try {
      const groupRef = collection(database, `groups`);
      const groupQuerySnapshot = await getDocs(
        query(groupRef, where("groupId", "==", groupId))
      );

      if (!groupQuerySnapshot.empty) {
        const groupDoc = groupQuerySnapshot.docs[0];

        const groupData = groupDoc.data();

        if (groupData.joinedPlayers.includes(auth.currentUser.uid)) {
          Alert.alert("Already Joined", "You have already joined this group.");
        } else {
          await updateDoc(groupDoc.ref, {
            joinedPlayers: arrayUnion(auth.currentUser.uid),
          });

          Alert.alert("Group Joined", "You've successfully joined the group!");
        }
      } else {
        Alert.alert(
          "Group Not Found",
          "The group you are trying to join does not exist."
        );
      }
    } catch (error) {
      console.error("Error updating user's joined groups: ", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.groupItem}>
      <View>
        <Text style={styles.groupName}>Name: {item.groupName}</Text>
        <Text style={styles.groupCategory}>Category: {item.gameCategoryName}</Text>
        <Text style={styles.joinedPlayers}>
          Joined Players:{"\n"}
          {item.joinedPlayers.map(player => `${player}\n`) || "None"}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.joinButton}
        onPress={() => handleGroupJoin(item.groupId)}
      >
        <Text style={styles.joinButtonText}>Join</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.groupsList}>
        <FlatList
          data={groups}
          ItemSeparatorComponent={() => (
            <View style={{ height: 5, backgroundColor: colors.gray }} />
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.groupId}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>No groups found.</Text>
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
  groupItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderColor: colors.darkGrey,
    backgroundColor: colors.lightGray,
  },
  groupName: {
    fontSize: 16,
    color: colors.white,
  },
  groupCategory: {
    fontSize: 14,
    color: colors.white,
  },
  joinButton: {
    backgroundColor: colors.blue,
    padding: 10,
    borderRadius: 5,
  },
  joinButtonText: {
    color: colors.white,
    fontSize: 14,
  },
  emptyListText: {
    textAlign: "center",
    margin: 20,
    fontSize: 16,
    color: colors.darkGrey,
  },
  groupsList: {
    flex: 1,
    backgroundColor: colors.white,
  },
  joinedPlayers: {
    fontSize: 14,
    color: colors.white,
  },
});

export default Groups;
