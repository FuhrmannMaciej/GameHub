import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
  Image,
} from "react-native";
import colors from "../colors";
import CreateNewPostHeaderLeft from "../components/createNewPostPage/CreateNewPostHeaderLeft";
import CreateNewPostHeaderRight from "../components/createNewPostPage/CreateNewPostHeaderRight";
import { TextInput } from "react-native-gesture-handler";
import EntypoIcon from "../components/EntypoIcon";
import * as ImagePicker from "expo-image-picker";
import { storage, database, auth } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Timestamp, addDoc, collection, doc, getDoc } from "firebase/firestore";

const CreateNewPost = ({navigation}) => {

  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  let imagePath = "";
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const uploadPost = () => {
    savePostToDatabase();
  };

  const savePostToDatabase = () => {
    return new Promise(async (resolve, reject) => {
      try {
        await uploadImage();
        addDoc(collection(database, `gamers/${auth.currentUser.uid}/posts`), {
          textContent: text,
          imagePath: imagePath,
          createdAt: Timestamp.now(),
          likes: 0,
          comments: 0
        })
        .then(() => {
          resolve();
        })
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
    console.log(result.assets[0].uri);

    if (result.assets[0].uri !== null) {
      setImage(result.assets[0].uri);
    }
  };

  
  const handleTextInputChange = async (text) => {
    if (text.length > 0) {
      setText(text);
    }
  };

  const uploadImage = () => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("Image in upload image method: ", image);
        if (image === null) {
          resolve(null);
        }
        const xhr = new XMLHttpRequest();
        xhr.onload = async function () {
          const blob = xhr.response;

          imagePath = `postImages/${auth.currentUser.uid}/image-${Timestamp.now()}`;
          const storageRef = ref(storage, imagePath);
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
        xhr.open("GET", image, true);
        xhr.send(null);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CreateNewPostHeaderLeft nav={navigation} />,
      headerRight: () => (
        <CreateNewPostHeaderRight nav={navigation} uploadPost={uploadPost} />
      ),
    });
  }, [navigation, image, text]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = auth.currentUser.uid;
      const userRef = doc(database, "gamers", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserInfo({ ...userData });
      }
    };

    const fetchAvatar = async () => {
      const avatarPath = `avatars/${auth.currentUser.uid}`;
      const storageRef = ref(storage, avatarPath);
      const url = await getDownloadURL(storageRef);
      setAvatarUrl(url);
    };

    fetchUserInfo();
    fetchAvatar();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.postHeader}>
      <TouchableOpacity style={styles.profilePicture}>
        {avatarUrl && (
          <Image style={styles.profileImage} source={{ uri: avatarUrl }} />
        )}
        </TouchableOpacity>
        <View style={styles.postHeaderRight}>
          <Text style={styles.username}>{userInfo?.firstName} {userInfo?.lastName}</Text>
        </View>
        <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
          <EntypoIcon name="images" />
        </TouchableOpacity>
      </View>
      <View style={styles.postInput}>
        <TextInput
          editable
          multiline
          placeholder="Ready to Tell Your Gamer Tale?"
          placeholderTextColor={colors.darkGrey}
          fontSize={18}
          onChangeText={handleTextInputChange}
          value={text}
        />
        {image && (
          <ImageBackground source={{ uri: image }} style={styles.postImage}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setImage(null)}
            >
              <EntypoIcon name="cross" color="black" />
            </TouchableOpacity>
          </ImageBackground>
        )}
      </View>
    </View>
  );
};

export default CreateNewPost;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGray,
    flex: 1,
  },
  profilePicture: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: colors.darkGrey,
    marginLeft: 15,
    marginRight: 15,
    overflow: "hidden",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 0.6,
    marginBottom: 20,
    marginTop: 10,
  },
  postHeaderRight: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.darkGrey,
  },
  postInput: {
    flex: 3,
    marginLeft: 10,
    marginRight: 10,
    padding: 15,
  },
  galleryButton: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    marginLeft: 15,
  },
  postImage: {
    width: "100%",
    height: "100%",
    marginBottom: 10,
    marginTop: 10,
    alignItems: "flex-end",
  },
  closeButton: {
    height: 40,
    width: 40,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginRight: 15,
  },
  profileImage: {
    flex: 1,
    resizeMode: "cover",
  },
});
