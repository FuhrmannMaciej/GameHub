import React, { useEffect } from "react";
import { View, StatusBar, StyleSheet, Text, Image } from "react-native";
import colors from "../colors";
import UserProfileHeader from "../components/UserProfileHeader";

const UserProfile = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <UserProfileHeader nav={navigation} />,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primaryDark} />
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
        />
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>johndoe@example.com</Text>
      </View>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray,
    flex: 1,
  },
  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userEmail: {
    fontSize: 16,
    color: colors.darkGray,
  },
});
