import React, { useEffect } from "react";
import { View, TouchableOpacity, Text, StatusBar, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../colors";
import { Entypo } from "@expo/vector-icons";

const Home = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ flexDirection: "row" }}>
          <Entypo
            name="camera"
            size={28}
            color={colors.lightGray}
            style={styles.camera}
          />
          <FontAwesome
            name="search"
            size={24}
            color={colors.lightGray}
            style={styles.search}
          />
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Chat")}
          style={styles.chatButton}
        >
          <Entypo name="chat" size={28} color={colors.lightGray} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={colors.primaryDark}
        />
      <View style={styles.secondHeader}>
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 15,
          }}
        >
          <Entypo name="home" size={28} color={colors.darkGrey} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 15,
          }}
        >
          <FontAwesome name="bell" size={28} color={colors.darkGrey} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 15,
          }}
        >
          <Entypo name="users" size={28} color={colors.darkGrey} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 15,
          }}
        >
          <Entypo
            name="dots-three-vertical"
            size={28}
            color={colors.darkGrey}
          />
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, backgroundColor: 'blue'}} />
      <View style={{flex: 2, backgroundColor: 'darkorange'}} />
      <View style={{flex: 3, backgroundColor: 'green'}} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray,
    flex: 1,
  },
  chatButton: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
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
  secondHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors.lightGray,
    flex: 0.7,
    marginBottom: 5,
  },
});
