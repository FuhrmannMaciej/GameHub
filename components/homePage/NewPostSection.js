import React, { Component } from "react";
import { View } from "react-native";
import colors from "../../colors";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import EntypoIcon from "../EntypoIcon";

class NewPostSection extends Component {
  render() {
    return (
      <View style={styles.newPostSection}>
        <TouchableOpacity style={styles.profilePicture} />
        <TouchableOpacity style={styles.newPostButton} />
        <TouchableOpacity style={styles.galleryIcon}>
          <EntypoIcon name="images" />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
});

export default NewPostSection;