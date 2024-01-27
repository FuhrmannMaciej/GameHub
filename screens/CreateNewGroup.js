// CreateNewGroup.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Button} from "react-native";
import colors from "../colors"; // Make sure to import your color styles
import { collection, getDocs, query, where, orderBy, limit, addDoc } from "firebase/firestore";
import { auth, database } from "../config/firebase";
import { Picker } from "@react-native-picker/picker";
import { TouchableOpacity } from "react-native-gesture-handler";

const CreateNewGroup = ({navigation}) => {
  const [groupName, setGroupName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [gameCategories, setGameCategories] = useState([]);

  useEffect(() => {
    // Fetch game categories when the component mounts
    const fetchGameCategories = async () => {
      try {
        const categoriesRef = collection(database, "gameCategories");
        const categoriesQuerySnapshot = await getDocs(categoriesRef);
        const categoriesData = categoriesQuerySnapshot.docs.map((doc) => doc.data());
        setGameCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching game categories: ", error);
      }
    };

    fetchGameCategories();
  }, []);

  const handleCreateGroup = async () => {
    try {
      // Get the last created group to determine the next groupId
      const lastGroupQuery = query(collection(database, "groups"), orderBy("groupId", "desc"), limit(1));
      const lastGroupSnapshot = await getDocs(lastGroupQuery);
  
      let newGroupId = 1; // Default if no groups exist yet
      if (!lastGroupSnapshot.empty) {
        const lastGroupData = lastGroupSnapshot.docs[0].data();
        newGroupId = lastGroupData.groupId + 1;
      }
  
      // Create the new group
      const newGroupData = {
        groupId: newGroupId,
        groupName: groupName,
        gameCategory: selectedCategory,
        joinedPlayers: [auth.currentUser.uid],
      };
  
      await addDoc(collection(database, `groups`), {
        ...newGroupData,
      });
  
      // Navigate back to the previous screen or handle navigation as needed
      navigation.goBack();
    } catch (error) {
      console.error("Error creating group: ", error);
      // Handle error, show alert, etc.
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Group Name</Text>
      <TextInput
        style={styles.input}
        value={groupName}
        onChangeText={(text) => setGroupName(text)}
      />

      <Text style={styles.label}>Select Game Category</Text>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
      >
        {gameCategories.map((category) => (
          <Picker.Item key={category.categoryId} label={category.categoryName} value={category.categoryId} />
        ))}
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleCreateGroup}>
            <Text style={styles.buttonText}>
              {" "}
              Create Group
            </Text>
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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 46,
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
    fontSize: 18
  }
});

export default CreateNewGroup;
