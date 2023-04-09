import React, { Component } from "react";
import { View, Text } from "react-native";
import colors from "../../colors";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import EntypoIcon from "../EntypoIcon"

class CreateNewPostHeaderLeft extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
        style={styles.backButton}
                onPress={() => this.props.nav.navigate("Home")}>
          <EntypoIcon name="arrow-long-left" color={colors.lightGray} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Create Post</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
},
backButton: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    width: 30,
    height: 30,
},
headerText: {
    fontSize: 20,
    color: colors.lightGray,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 7,
    marginBottom: 10,
    marginRight: 10,
},
});

export default CreateNewPostHeaderLeft;
