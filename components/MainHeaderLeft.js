import React, { Component } from "react";
import { View } from "react-native";
import colors from "../colors";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import EntypoIcon from "./EntypoIcon";

class MainHeaderLeft extends Component {
  render() {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity>
          <EntypoIcon
            name="camera"
            color={colors.lightGray}
            style={styles.camera}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <EntypoIcon
            name="magnifying-glass"
            size={24}
            color={colors.lightGray}
            style={styles.search}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  camera: {
    marginLeft: 15,
  },
  search: {
    marginLeft: 15,
    borderBottomWidth: 2,
    borderBottomColor: colors.lightGray,
    paddingBottom: 5,
    width: 280,
  },
});

export default MainHeaderLeft;
