import React, { useEffect } from "react";
import { View, TouchableOpacity, Text, StatusBar, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../colors";
import SecondHeader from "../components/SecondHeader";
import MainHeaderLeft from "../components/MainHeaderLeft";
import MainHeaderRight from "../components/MainHeaderRight";
import { Entypo } from "@expo/vector-icons";

const Home = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MainHeaderLeft />
      ),
      headerRight: () => (
        <MainHeaderRight nav={navigation}/>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={colors.primaryDark}
        />
      <SecondHeader />
      <View style={styles.newPostSection}>
        <TouchableOpacity style={styles.profilePicture}/>
        <TouchableOpacity style={styles.newPostButton}/>
        <TouchableOpacity style={styles.galleryIcon}>
          <Entypo name="images" size={28} color={colors.darkGrey} />
        </TouchableOpacity>
        </View>


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
  newPostSection : {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors.lightGray,
    flex: 1,
    marginBottom: 7
  },
  profilePicture: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: colors.darkGrey,
    marginLeft: 15,
    marginRight: 15,
  },
  newPostButton: {
    height: 50,
    width: 250,
    borderRadius: 50,
    borderColor: colors.darkGrey,
    borderWidth: 2,
    marginRight: 15,
  },
});
