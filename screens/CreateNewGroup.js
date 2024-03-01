import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../colors";
import { collection, getDocs} from "firebase/firestore";
import { database } from "../config/firebase";
import { Picker } from "@react-native-picker/picker";

const CreateNewGroup = ({ navigation }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGroupType, setSelectedGroupType] = useState("public");
  const [gameCategories, setGameCategories] = useState([]);

  useEffect(() => {
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

  const navigateToGroupTypeScreen = () => {
    // Navigate to a screen based on the selected group type
    if (selectedGroupType === "public") {
      navigation.navigate("PublicGroupDetails", {
        groupName,
        gameCategory: selectedCategory,
        gameCategories: gameCategories,
        description: "",
        maxPlayers: "",
        joiningRequirements: "",
      });
    } else {
      navigation.navigate("PrivateGroupDetails", {
        groupName,
        gameCategory: selectedCategory,
        gameCategories: gameCategories,
        description: "",
        maxPlayers: "",
        joiningRequirements: "",
      });
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
          <Picker.Item
            key={category.categoryId}
            label={category.categoryName}
            value={category.categoryId}
          />
        ))}
      </Picker>

      {/* Added group type selection */}
      <Text style={styles.label}>Select Group Type</Text>
      <Picker
        selectedValue={selectedGroupType}
        onValueChange={(itemValue) => setSelectedGroupType(itemValue)}
      >
        <Picker.Item label="Public" value="public" />
        <Picker.Item label="Private" value="private" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={navigateToGroupTypeScreen}>
        <Text style={styles.buttonText}>Next</Text>
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
