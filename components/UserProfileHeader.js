import React, { Component } from "react";
import { View } from "react-native";
import colors from "../colors";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import EntypoIcon from "./EntypoIcon";

class UserProfileHeader extends Component {
  render() {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
        style={styles.backButton}
                onPress={() => this.props.nav.navigate("Home")}>
          <EntypoIcon name="arrow-long-left" color={colors.lightGray} />
        </TouchableOpacity>
        {/* <TouchableOpacity>
          <EntypoIcon
            name="magnifying-glass"
            size={24}
            color={colors.lightGray}
            style={styles.search}
          />
        </TouchableOpacity> */}
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
    marginTop: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.lightGray,
    paddingBottom: 5,
    width: 330,
  },
  backButton: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    width: 30,
    height: 30,
},
});

export default UserProfileHeader;
