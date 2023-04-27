import React, { Component } from "react";
import { View, Text, Image } from "react-native";
import colors from "../../colors";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import EntypoIcon from "../EntypoIcon";
import PostFooter from "./postSection/PostFooter";
import { useState } from "react";
import { useLayoutEffect } from "react";

const PostSection = props => {
  const [imageUrl, setImageUrl] = useState("");

  useLayoutEffect(() => {
    if (props.imagePath) {
      setImageUrl(props.imagePath);
      console.log("imagePath: ", props.imagePath);
    }
  }, [props.imagePath]);

    return (
      <View style={styles.container}>
        <View style={styles.postHeader}>
          <TouchableOpacity style={styles.profilePicture} />
          <View style={styles.postHeaderRight}>
            <Text style={styles.username}>{props.username}</Text>
            <Text style={styles.whenPosted}>{props.whenPosted}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton}>
            <EntypoIcon name="cross" />
          </TouchableOpacity>
        </View>
        <View style={styles.postContent}>
          <Text style={styles.postText}>{props.textContent}</Text>
          <Image source={imageUrl} />
        </View>
        <PostFooter likes={props.likes} comments={props.comments} />
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    height: 500,
    backgroundColor: colors.lightGray,
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
    backgroundColor: colors.lightGray,
    flex: 0.6,
  },
  postHeaderRight: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: colors.lightGray,
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.darkGrey,
  },
  whenPosted: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  postContent: {
    flex: 3,
  },
  postText: {
    fontSize: 16,
    color: colors.darkGrey,
    marginLeft: 20,
    marginTop: 20,
  },
  closeButton: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    marginLeft: 15,
  }
});

export default PostSection;
