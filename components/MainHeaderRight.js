import React, { Component } from "react";
import { Entypo } from "@expo/vector-icons";
import colors from "../colors";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

class MainHeaderRight extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.nav.navigate("Chat")}
        style={styles.chatButton}
      >
        <Entypo name="chat" size={28} color={colors.lightGray} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  chatButton: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
});

export default MainHeaderRight;
