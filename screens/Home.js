import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../colors";
import SecondHeader from "../components/SecondHeader";
import MainHeaderLeft from "../components/MainHeaderLeft";
import MainHeaderRight from "../components/MainHeaderRight";
import EntypoIcon from "../components/EntypoIcon";

const Home = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MainHeaderLeft />,
      headerRight: () => <MainHeaderRight nav={navigation} />,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primaryDark} />
      <SecondHeader />
      <View style={styles.newPostSection}>
        <TouchableOpacity style={styles.profilePicture} />
        <TouchableOpacity style={styles.newPostButton} />
        <TouchableOpacity style={styles.galleryIcon}>
          <EntypoIcon name="images" />
        </TouchableOpacity>
      </View>
      <View style={styles.postList}>
        <View style={styles.postHeader}>
          <TouchableOpacity style={styles.profilePicture} />
          <View style={styles.postHeaderRight}>
            <Text style={styles.username}>Username</Text>
            <Text style={styles.location}>Location</Text>
          </View>
          <TouchableOpacity style={styles.closeButton}>
            <EntypoIcon name="cross" />
          </TouchableOpacity>
        </View>
        <View style={styles.postImage}>
          <Text>Image here</Text>
        </View>
        <View style={styles.postFooter}>
          <TouchableOpacity style={styles.postFooterTop}>
            <View style={styles.postLikes}>
              <EntypoIcon name="heart" color="red" style={styles.likeIcon}/>
              <Text style={styles.likesCount}>40</Text>
            </View>
            <View style={styles.postComments}>
              <Text style={styles.commentsCount}>10</Text>
              <Text style={styles.comments}>comments</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.postFooterButtons}>
            <TouchableOpacity style={styles.postFooterButton}>
              <EntypoIcon name="thumbs-up" />
              <Text style={styles.postFooterButtonText}>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postFooterButton}>
              <EntypoIcon name="message" />
              <Text style={styles.postFooterButtonText}>Comment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postFooterButton}>
              <EntypoIcon name="paper-plane" />
              <Text style={styles.postFooterButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray,
    flex: 1,
  },
  newPostSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors.lightGray,
    flex: 1,
    marginBottom: 7,
  },
  profilePicture: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: colors.darkGrey,
    marginLeft: 15,
    marginRight: 15,
  },
  newPostButton: {
    height: 40,
    width: 250,
    borderRadius: 50,
    borderColor: colors.darkGrey,
    borderWidth: 2,
  },
  galleryIcon: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    marginLeft: 15,
  },
  postList: {
    flex: 4,
    backgroundColor: colors.lightGray,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors.lightGray,
    flex: 1,
  },
  postHeaderRight: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    height: "100%",
    backgroundColor: colors.lightGray,
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.darkGrey,
  },
  location: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  postImage: {
    flex: 3,
    width: "100%",
    backgroundColor: colors.darkGrey,
  },
  postFooter: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors.lightGray,
    flex: 1,
    marginBottom: 7,
  },
  postFooterTop: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors.lightGray,
    flex: 1,
    marginBottom: 7,
  },
  postFooterButton: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    marginLeft: 15,
  },
  postFooterRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors.lightGray,
    flex: 1,
    marginBottom: 7,
  },
  saveButton: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    marginLeft: 15,
  },
  postCaption: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors.lightGray,
    flex: 1,
    marginBottom: 7,
  },
  caption: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  postLikes: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors.lightGray,
    flex: 1,
    marginBottom: 7,
  },
  likes: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  postComments: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors.lightGray,
    flex: 1,
    marginBottom: 7,
  },
  comments: {
    fontSize: 14,
    color: colors.darkGrey,
    marginRight: 15,
  },
  commentsCount: {
    fontSize: 14,
    color: colors.darkGrey,
    marginRight: 5,
  },
  closeButton: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    marginLeft: 15,
  },
  postFooterButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "space-between",
    width: "100%",
    height: "100%",
    backgroundColor: colors.lightGray,
    flex: 1,
    marginBottom: 7,
  },
  postFooterButtonText: {
    fontSize: 14,
    color: colors.darkGrey,
    marginLeft: 10,
  },
  likeIcon: {
    marginLeft: 15,
  },
  likesCount: {
    fontSize: 14,
    color: colors.darkGrey,
    marginLeft: 8,
  },
});
