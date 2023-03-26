import React, { Component } from "react";
import { View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import colors from "../colors";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

class SecondHeader extends Component {
  render() {
    return (
      <View style={styles.secondHeader}>
        <TouchableOpacity style={styles.icon}>
          <Entypo name="home" size={28} color={colors.darkGrey} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <Entypo name="bell" size={28} color={colors.darkGrey} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <Entypo name="users" size={28} color={colors.darkGrey} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <Entypo
            name="dots-three-vertical"
            size={28}
            color={colors.darkGrey}
          />
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
    flex: 0.7,
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
