import React, { Component } from "react";
import { View, Text } from "react-native";
import colors from "../../../colors";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import EntypoIcon from "../../EntypoIcon";

class PostFooter extends Component {
  render() {
    return (
      <View style={styles.postFooter}>
        <View style={styles.postFooterTop}>
          <View style={styles.postLikes}>
            <EntypoIcon name="heart" color="red" style={styles.likeIcon} />
            <Text style={styles.likesCount}>40</Text>
          </View>
          <View style={styles.postComments}>
            <Text style={styles.commentsCount}>10</Text>
            <Text style={styles.comments}>comments</Text>
          </View>
        </View>
        <View style={styles.postFooterBottom}>
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
    );
  }
}

const styles = StyleSheet.create({
  postFooter: {
    backgroundColor: colors.lightGray,
    flex: 1,
    marginBottom: 7,
  },
  postFooterTop: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
    marginBottom: 7,
  },
  postFooterBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "space-between",
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
  postFooterButton: {
    flexDirection: "row",
    flex: 1,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    marginLeft: 15,
  },
  postLikes: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
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
});

export default PostFooter;
