import React, { useEffect } from "react";
import { View, StatusBar, StyleSheet, Text, Image } from "react-native";
import colors from "../colors";
import UserProfileHeader from "../components/UserProfileHeader";
import { TouchableOpacity } from "react-native-gesture-handler";
import EntypoIcon from "../components/EntypoIcon";
import { auth } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { database } from "../config/firebase";
import { useState } from "react";
import { format } from "date-fns";

const UserProfile = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <UserProfileHeader nav={navigation} />,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = auth.currentUser.uid;
      const userRef = doc(database, "gamers", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const dateOfBirth = new Date(userData.dateOfBirth.seconds * 1000);
        setUserInfo({ ...userData, dateOfBirth });
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primaryDark} />
      <View style={styles.profileCover}>
        <Image style={styles.profileCoverImage} />
      </View>
      <View style={styles.profileContainer}>
        <TouchableOpacity style={styles.profilePicture}>
          <Image style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.userName}>{userInfo?.firstName} {userInfo?.lastName}</Text>
        <View style={styles.chatAndSettings}>
          <TouchableOpacity style={styles.chatButton}>
            <EntypoIcon name="chat" color={colors.darkGrey} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton}>
            <EntypoIcon name="dots-three-horizontal" color={colors.darkGrey} />
          </TouchableOpacity>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>
            Email: {auth.currentUser.email}
          </Text>
          <Text style={styles.userInfoText}>Date of Birth: {userInfo?.dateOfBirth && format(userInfo.dateOfBirth, "MM/dd/yyyy")}</Text>
        </View>
      </View>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGray,
    flex: 1,
  },
  profileCover: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.gray,
  },
  profileContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicture: {
    height: 150,
    width: 150,
    borderRadius: 80,
    backgroundColor: colors.darkGrey,
    marginLeft: 15,
    marginRight: 15,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  chatAndSettings: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    width: "40%",
    flex: 0.2,
  },
  userInfo: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: 0.6,
    width: "80%",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  userInfoText: {
    fontSize: 16,
    color: colors.darkGray,
    marginBottom: 10,
  },
});
