import React, { useEffect } from "react";
import { View, StatusBar, StyleSheet, Text } from "react-native";
import colors from "../colors";
import UserProfileHeader from "../components/UserProfileHeader";
import { TouchableOpacity } from "react-native-gesture-handler";
import EntypoIcon from "../components/EntypoIcon";
import { auth } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { database } from "../config/firebase";
import { useState } from "react";
import { format } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import { ImageBackground } from "react-native";

const UserProfile = ({ navigation, route }) => {
  const userId = route.params.userId || auth.currentUser.uid;
  const [userInfo, setUserInfo] = useState(null);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <UserProfileHeader nav={navigation} />,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userRef = doc(database, "gamers", userId);
        const userDoc = await getDoc(userRef);
    
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData && userData.dateOfBirth && userData.email) {
            const dateOfBirth = new Date(userData.dateOfBirth.seconds * 1000);
            const email = userData.email;
            setUserInfo({ ...userData, dateOfBirth, email });
          } else {
            console.error("userData or its properties are undefined or missing.");
          }
        } else {
          console.error("User document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    

    const fetchAvatar = async () => {
      const avatarPath = `avatars/${userId}`;
      const storageRef = ref(storage, avatarPath);
      const url = await getDownloadURL(storageRef);
      setAvatar(url);
    };

    fetchUserInfo();
    fetchAvatar();
  }, []);

  useEffect(() => {
    if (avatar === "") return;
    uploadAvatar();
  }, [avatar]);

  const pickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
    console.log(result.assets[0].uri);

    if (result.assets[0].uri !== null) {
      setAvatar(result.assets[0].uri);
    }
  };

  const uploadAvatar = () => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("Image in upload avatar method: ", avatar);
        if (avatar === null) {
          resolve(null);
        }
        const xhr = new XMLHttpRequest();
        xhr.onload = async function () {
          const blob = xhr.response;

          avatarPath = `avatars/${userId}`;
          const storageRef = ref(storage, avatarPath);
          const uploadTask = uploadBytes(storageRef, blob);

          uploadTask
            .then(async (snapshot) => {
              const url = await getDownloadURL(snapshot.ref);
              console.log("Download URL: ", url);
              resolve(url);
              blob.close();
            })
            .catch((error) => {
              console.log(error);
              reject(error);
              blob.close();
            });
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", avatar, true);
        xhr.send(null);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primaryDark} />
      <View style={styles.profileContainer}>
        <TouchableOpacity style={styles.profilePicture} onPress={pickAvatar}>
          {avatar !== "" && (
            <ImageBackground
              source={{ uri: avatar }}
              style={styles.avatarImage}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.userName}>
          {userInfo?.firstName} {userInfo?.lastName}
        </Text>
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
            Email: {userInfo?.email}
          </Text>
          <Text style={styles.userInfoText}>
            Date of Birth:{" "}
            {userInfo?.dateOfBirth &&
              format(userInfo.dateOfBirth, "MM/dd/yyyy")}
          </Text>
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
  profileContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicture: {
    height: 150,
    width: 150,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: colors.darkGrey,
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
  closeButton: {
    height: 40,
    width: 40,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginRight: 15,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    alignItems: "flex-end",
  },
});
