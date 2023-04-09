import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../colors";
import CreateNewPostHeaderLeft from "../components/createNewPostPage/CreateNewPostHeaderLeft";
import CreateNewPostHeaderRight from "../components/createNewPostPage/CreateNewPostHeaderRight";

const CreateNewPost = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CreateNewPostHeaderLeft nav={navigation} />,
      headerRight: () => <CreateNewPostHeaderRight nav={navigation}/>,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>

    </View>
  );
};

export default CreateNewPost;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray,
    flex: 1,
  },
});
