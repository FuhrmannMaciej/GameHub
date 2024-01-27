import React from "react";
import colors from "../../colors";
import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const GroupsHeaderRight = props => {

    return (
      <TouchableOpacity
        onPress={() => {
          props.nav.navigate("CreateNewGroup")
        }}
        style={styles.postButton}
      >
        <Text style={styles.postButtonText}>Create</Text>
      </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  postButton: {
    marginRight: 10,
    width: 60,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center"
  },
  postButtonText: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "bold"
  }
});

export default GroupsHeaderRight;
