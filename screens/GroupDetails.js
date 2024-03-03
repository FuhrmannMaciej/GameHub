import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../colors";

const GroupDetails = ({ route, navigation }) => {
  const { groupDetails } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{groupDetails.groupName}</Text>

      <Text style={styles.label}>Category:</Text>
      <Text style={styles.value}>{groupDetails.gameCategoryName}</Text>

      <Text style={styles.label}>Type:</Text>
      <Text style={styles.value}>
        {groupDetails.groupType === "public" ? "Public" : "Private"}
      </Text>

      <Text style={styles.label}>Joined Players:</Text>
      <Text style={styles.value}>
        {groupDetails.joinedPlayers.map((player) => `${player}\n`) || "None"}
      </Text>

      <Text style={styles.label}>Description:</Text>
      <Text style={styles.value}>{groupDetails.description}</Text>

      <TouchableOpacity
        style={styles.groupChatButton}
        onPress={() => {
          navigation.navigate("GroupChat", { groupDetails });
        }}
      >
        <Text style={styles.groupChatButtonText}>Open Group Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGray,
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 10,
  },
  groupChatButton: {
    backgroundColor: colors.blue,
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  groupChatButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default GroupDetails;
