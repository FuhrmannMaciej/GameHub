import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Button,
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
import { database, auth } from "../config/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import GroupsHeaderLeft from "../components/groupsPage/GroupsHeaderLeft";
import GroupsHeaderRight from "../components/groupsPage/GroupsHeaderRight";
import { useIsFocused } from "@react-navigation/native";

const Groups = ({ navigation }) => {
  const [groups, setGroups] = useState([]);
  const [isPasswordPromptVisible, setIsPasswordPromptVisible] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
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
    try {
      if (Array.isArray(joinedPlayers)) {
        for (let i = 0; i < joinedPlayers.length; i++) {
          const userRef = doc(database, "gamers", joinedPlayers[i]);
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data();
          joinedPlayers[i] = `${userData.firstName}`;
        }
        return joinedPlayers;
      } else {
        console.error("Invalid joinedPlayers field or not an array.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching user info: ", error);
      return [];
    }
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

  const handleGroupJoin = async (groupId, maxPlayers, groupType) => {
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
          if (groupType === "private") {
            setSelectedGroup(groupDoc);
            setIsPasswordPromptVisible(true);
          } else {
            joinGroup(groupDoc, maxPlayers);
          }
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

  const joinGroup = async (groupDoc, maxPlayers) => {
    try {
      console.log("groupDoc:", groupDoc);

      const groupData = groupDoc.data();

      if (groupData && Array.isArray(groupData.joinedPlayers)) {
        if (groupData.joinedPlayers.length < maxPlayers) {
          const updatedJoinedPlayers = [
            ...groupData.joinedPlayers,
            auth.currentUser.uid,
          ];

          await updateDoc(groupDoc.ref, {
            joinedPlayers: updatedJoinedPlayers,
          });
          Alert.alert("Group Joined", "You've successfully joined the group!");
        } else {
          Alert.alert("Group Full", "This group is already full.");
        }
      } else {
        console.error(
          "Invalid group data or joinedPlayers field is not an array."
        );
      }
    } catch (error) {
      console.error("Error joining group: ", error);
    }
  };

  const handlePasswordSubmit = () => {

    const groupData = selectedGroup.data();
  
      if (groupData.password === passwordInput) {
        setIsPasswordPromptVisible(false);
  
        joinGroup(selectedGroup, groupData.maxPlayers);
      } else {
        Alert.alert("Incorrect Password", "The entered password is incorrect.");
      }
  };
  
  const handleCloseModal = () => {
    setIsPasswordPromptVisible(false);
    setSelectedGroup(null);
    setPasswordInput("");
  };

  const renderItem = ({ item }) => (
    <View style={styles.groupItem}>
      <View>
        <Text style={styles.groupName}>Name: {item.groupName}</Text>
        <Text style={styles.groupCategory}>
          Category: {item.gameCategoryName}
        </Text>
        <Text style={styles.groupType}>
          Type: {item.groupType === "public" ? "Public" : "Private"}
        </Text>
        <Text style={styles.joinedPlayers}>
          Joined Players:{"\n"}
          {item.joinedPlayers.map((player) => `${player}\n`) || "None"}
        </Text>
        <Text style={styles.playerCounter}>
          {item.joinedPlayers.length}/{item.maxPlayers} joined
        </Text>
      </View>
      <TouchableOpacity
        style={styles.joinButton}
        onPress={() => {
            handleGroupJoin(item.groupId, item.maxPlayers, item.groupType);
        }}
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

      <Modal
        visible={isPasswordPromptVisible}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.passwordContainer}>
          <View style={styles.passwordModal}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Enter Group Password</Text>
            <TextInput
              secureTextEntry
              value={passwordInput}
              onChangeText={setPasswordInput}
              style={styles.passwordInput}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handlePasswordSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  playerCounter: {
    fontSize: 12,
    color: colors.white,
  },
  passwordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  passwordModal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    maxHeight: "70%",
    width: "80%",
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.darkGrey,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  passwordInput: {
    height: 50,
    borderColor: colors.darkGrey,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    width: "100%",
  },
  submitButton: {
    backgroundColor: colors.primaryDark,
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  submitButtonText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 18,
  },
});

export default Groups;
