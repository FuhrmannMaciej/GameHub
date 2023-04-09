import React, { Component } from "react";
import { View, Text } from "react-native";
import colors from "../../colors";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import EntypoIcon from "../EntypoIcon";
import PostFooter from "./postSection/PostFooter";

class PostSection extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.postHeader}>
          <TouchableOpacity style={styles.profilePicture} />
          <View style={styles.postHeaderRight}>
            <Text style={styles.username}>{this.props.username}</Text>
            <Text style={styles.whenPosted}>When</Text>
          </View>
          <TouchableOpacity style={styles.closeButton}>
            <EntypoIcon name="cross" />
          </TouchableOpacity>
        </View>
        <View style={styles.postContent}>
          <Text>Image here</Text>
        </View>
        <PostFooter />
      </View>
    );
  }
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
    backgroundColor: colors.primary,
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
