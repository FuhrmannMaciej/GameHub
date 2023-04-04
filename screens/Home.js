import React, { useEffect } from "react";
import {
  View,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../colors";
import SecondHeader from "../components/SecondHeader";
import MainHeaderLeft from "../components/MainHeaderLeft";
import MainHeaderRight from "../components/MainHeaderRight";
import NewPostSection from "../components/homePage/NewPostSection";
import PostSection from "../components/homePage/PostSection";

const Home = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MainHeaderLeft />,
      headerRight: () => <MainHeaderRight nav={navigation} />,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primaryDark} />
      <SecondHeader />
      <NewPostSection />
      <PostSection />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray,
    flex: 1,
  },
});
