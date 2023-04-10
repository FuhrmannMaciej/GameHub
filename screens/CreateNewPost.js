import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../colors";
import CreateNewPostHeaderLeft from "../components/createNewPostPage/CreateNewPostHeaderLeft";
import CreateNewPostHeaderRight from "../components/createNewPostPage/CreateNewPostHeaderRight";
import { TextInput } from "react-native-gesture-handler";
import EntypoIcon from "../components/EntypoIcon";
import * as ImagePicker from "expo-image-picker";

const CreateNewPost = () => {
  const navigation = useNavigation();

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    console.log(result.assets);

    if (result.assets != null) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CreateNewPostHeaderLeft nav={navigation} />,
      headerRight: () => <CreateNewPostHeaderRight nav={navigation} />,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.postHeader}>
        <TouchableOpacity style={styles.profilePicture} />
        <View style={styles.postHeaderRight}>
          <Text style={styles.username}>Username</Text>
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
    borderRadius: 50,
    backgroundColor: colors.darkGrey,
    marginLeft: 15,
    marginRight: 15,
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
});
