import React, { Component } from "react";
import { View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import colors from "../colors";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

class MainHeaderLeft extends Component {
  render() {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity>
          <Entypo
            name="camera"
            size={28}
            color={colors.lightGray}
            style={styles.camera}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo
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
