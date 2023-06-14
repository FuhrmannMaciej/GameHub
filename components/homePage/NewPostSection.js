import React, { Component } from "react";
import { View, Text } from "react-native";
import colors from "../../colors";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import EntypoIcon from "../EntypoIcon";

class NewPostSection extends Component {
  render() {
    return (
      <View style={styles.newPostSection}>
        <TouchableOpacity style={styles.profilePicture} 
        onPress={() => this.props.nav.navigate("UserProfile")}/>
        <TouchableOpacity style={styles.newPostButton}
        onPress={() => this.props.nav.navigate("CreateNewPost")}>
          <Text style={styles.newPostButtonPlaceholder}>Ready to Tell Your Gamer Tale?</Text>
        </TouchableOpacity>
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
    flex: 0.6,
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
  newPostButtonPlaceholder: {
    color: colors.darkGrey,
    fontSize: 14,
    textAlign: "center",
    marginTop: 7,
  },
});

export default NewPostSection;
