import React, { Component } from "react";
import { View } from "react-native";
import colors from "../colors";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import EntypoIcon from "./EntypoIcon";

class SecondHeader extends Component {
  render() {
    return (
      <View style={styles.secondHeader}>
        <TouchableOpacity style={styles.icon}
        onPress={() => 
        this.props.nav.navigate("Home")}>
          <EntypoIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <EntypoIcon name="bell" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <EntypoIcon name="users" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <EntypoIcon name="dots-three-vertical" />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  secondHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors.lightGray,
    flex: 0.4,
    marginBottom: 2,
  },
  icon: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    marginLeft: 15,
  },
});

export default SecondHeader;
