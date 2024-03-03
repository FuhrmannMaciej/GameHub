import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../colors";
import { database, auth } from "../config/firebase";
import { getDocs, collection, addDoc, query, orderBy, limit } from "firebase/firestore";

const PublicGroupCreate = ({ route, navigation }) => {
  const { groupName, gameCategory, description, maxPlayers, joiningRequirements, gameCategories } = route.params;
  const [groupDescription, setGroupDescription] = useState(description || "");
  const [maxPlayersCount, setMaxPlayersCount] = useState(maxPlayers || "");

  const getCategoryNameById = (categoryId, categories) => {
    const category = categories.find((c) => c.categoryId === categoryId);
    return category ? category.categoryName : "";
  };

  const handleCreateGroup = async () => {
    try {
      const lastGroupQuery = query(collection(database, "groups"), orderBy("groupId", "desc"), limit(1));
      const lastGroupSnapshot = await getDocs(lastGroupQuery);

      let newGroupId = 1;
      if (!lastGroupSnapshot.empty) {
        const lastGroupData = lastGroupSnapshot.docs[0].data();
        newGroupId = lastGroupData.groupId + 1;
      }

      const newGroupData = {
        groupId: newGroupId,
        groupName: groupName,
        gameCategory: gameCategory,
        groupType: "public",
        description: groupDescription,
        maxPlayers: parseInt(maxPlayersCount, 10),
        joiningRequirements: joiningRequirements,
        joinedPlayers: [auth.currentUser.uid],
      };

      await addDoc(collection(database, "groups"), newGroupData);

      navigation.navigate("Groups");
    } catch (error) {
      console.error("Error creating public group: ", error);
    }
  };

  const categoryName = getCategoryNameById(gameCategory, gameCategories);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Group Name</Text>
      <Text style={styles.readOnlyText}>{groupName}</Text>

      <Text style={styles.label}>Game Category</Text>
      <Text style={styles.readOnlyText}>{categoryName}</Text>

      <Text style={styles.label}>Group Type</Text>
      <Text style={styles.readOnlyText}>Public</Text>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={groupDescription}
        onChangeText={(text) => setGroupDescription(text)}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Max Players</Text>
      <TextInput
        style={styles.input}
        value={maxPlayersCount.toString()}
        onChangeText={(text) => setMaxPlayersCount(text)}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateGroup}>
        <Text style={styles.buttonText}>Create Group</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  readOnlyText: {
    fontSize: 16,
    marginBottom: 16,
    color: colors.darkGrey,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: colors.primaryDark,
    height: 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
    marginTop: 50,
  },
  buttonText: {
    fontWeight: "bold", 
    color: "#fff", 
    fontSize: 18,
  },
});

export default PublicGroupCreate;
