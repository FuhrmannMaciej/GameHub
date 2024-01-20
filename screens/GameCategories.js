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
import { collection, query, getDocs, doc, updateDoc } from "firebase/firestore";
import { database } from "../config/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../config/firebase";

const GameCategories = ({ navigation }) => {
  const [gameCategories, setGameCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const fetchGameCategories = async () => {
    try {
      const categoriesRef = collection(database, "gameCategories");
      const querySnapshot = await getDocs(categoriesRef);
      const categories = querySnapshot.docs.map((doc) => ({
        categoryId: doc.id,
        ...doc.data(),
      }));
      setGameCategories(categories);
    } catch (error) {
      console.error("Error fetching game categories: ", error);
    }
  };

  useEffect(() => {
    fetchGameCategories();
  }, []);

  const handleCategoryAddition = async (categoryId) => {
    if (selectedCategories.length < 3) {
      if (!selectedCategories.includes(categoryId)) {
        setSelectedCategories([...selectedCategories, categoryId]);

        try {
          const userDocRef = doc(database, "gamers", auth.currentUser.uid);
          await updateDoc(userDocRef, {
            favoriteCategories: [...selectedCategories, categoryId],
          });
        } catch (error) {
          console.error("Error updating user's favorite categories: ", error);
        }
      } else {
        Alert.alert("Category already added", "You've already added this category to your favorites.");
      }
    } else {
      Alert.alert("Maximum Limit Reached", "You can add a maximum of 3 categories.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.categoryItem}>
      <Text style={styles.categoryName}>{item.categoryName}</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleCategoryAddition(item.categoryId)}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.categoriesList}>
        <FlatList
          data={gameCategories}
          ItemSeparatorComponent={() => (
            <View style={{ height: 5, backgroundColor: colors.gray }} />
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.categoryId}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>No game categories found.</Text>
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
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderColor: colors.darkGrey,
    backgroundColor: colors.lightGray,
  },
  categoryName: {
    fontSize: 16,
    color: colors.darkGrey,
  },
  addButton: {
    backgroundColor: colors.blue,
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 14,
  },
  emptyListText: {
    textAlign: "center",
    margin: 20,
    fontSize: 16,
    color: colors.darkGrey,
  },
  categoriesList: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
});

export default GameCategories;
