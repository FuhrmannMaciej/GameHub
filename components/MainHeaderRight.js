import React, { Component } from "react";
import colors from "../colors";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import EntypoIcon from "./EntypoIcon";

class MainHeaderRight extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.nav.navigate("StartChat")}
        style={styles.chatButton}
      >
        <EntypoIcon name="chat" color={colors.lightGray} />
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
