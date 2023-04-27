import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, StatusBar, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../colors";
import SecondHeader from "../components/SecondHeader";
import MainHeaderLeft from "../components/MainHeaderLeft";
import MainHeaderRight from "../components/MainHeaderRight";
import NewPostSection from "../components/homePage/NewPostSection";
import PostSection from "../components/homePage/PostSection";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { database } from "../config/firebase";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MainHeaderLeft />,
      headerRight: () => <MainHeaderRight nav={navigation} />,
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const gamersRef = collection(database, "gamers");
    const q = query(gamersRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsArray = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const postsRef = collection(database, `gamers/${doc.id}/posts`);
        const q = query(postsRef, orderBy("createdAt", "desc"));
        onSnapshot(q, (querySnapshotPosts) => {
          querySnapshotPosts.forEach((docPosts) => {
            const dataPosts = docPosts.data();
            postsArray.push({
              _id: docPosts.id,
              firstName: data.firstName,
              lastName: data.lastName,
              textContent: dataPosts.textContent,
              createdAt: dataPosts.createdAt.toDate(),
              imagePath: dataPosts.imagePath,
              likes: dataPosts.likes,
              comments: dataPosts.comments,
            });
          });
        });
      });
      setPosts(postsArray);
      console.log(posts);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primaryDark} />
      <SecondHeader />
      <NewPostSection nav={navigation} />
      <SafeAreaView style={styles.postSectionList}>
        <FlatList
          style={styles.postSectionList}
          data={posts}
          renderItem={({ item }) =>
          <PostSection username={item.firstName + " " + item.lastName} whenPosted={item.createdAt.toLocaleString()}
          textContent={item.textContent} imagePath={item.imagePath} likes={item.likes} comments={item.comments}
         />}
          keyExtractor={(item) => item._id}
        />
      </SafeAreaView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray,
    flex: 1,
  },
  postSectionList: {
    flex: 4,
    backgroundColor: colors.lightGray,
  },
});
