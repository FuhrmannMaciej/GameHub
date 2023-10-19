import React, { useEffect, useState, useCallback } from "react";
import { View, StatusBar, StyleSheet, RefreshControl } from "react-native";
import colors from "../colors";
import SecondHeader from "../components/SecondHeader";
import MainHeaderLeft from "../components/MainHeaderLeft";
import MainHeaderRight from "../components/MainHeaderRight";
import NewPostSection from "../components/homePage/NewPostSection";
import PostSection from "../components/homePage/PostSection";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, query, orderBy } from "firebase/firestore";
import { database } from "../config/firebase";
import { getDocs } from "firebase/firestore";
import { auth } from "../config/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

const Home = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  const fetchAvatar = async () => {
    try {
      const avatarPath = `avatars/${auth.currentUser.uid}`;
      const storageRef = ref(storage, avatarPath);
      const url = await getDownloadURL(storageRef);
      setAvatarUrl(url);
    } catch (error) {
      setAvatarUrl("");
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchAvatar();
    });

    return unsubscribe;
  }, [navigation]);

  const handleRefresh = useCallback(async () => {
  console.log("Refresh started");
  setRefreshing(true);
  await generatePostsList(setPosts);
  setRefreshing(false);
  console.log("Refresh completed");
}, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MainHeaderLeft nav={navigation}/>,
      headerRight: () => <MainHeaderRight nav={navigation} />,
    });

    generatePostsList(setPosts);
  }, [navigation]);

  const renderPostSection = ({ item }) => {
            return (
              <PostSection
                id={item._id}
                username={item.firstName + " " + item.lastName}
                whenPosted={item.createdAt.toLocaleString('en-GB')}
                textContent={item.textContent}
                imagePath={item.imagePath}
                likes={item.likes}
                comments={item.comments}
              />
            );
          };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primaryDark} />
      <SecondHeader nav={navigation} />
      <NewPostSection nav={navigation} avatarUrl={avatarUrl}/>
      <SafeAreaView style={styles.postSectionList}>
        <FlatList
          data={posts}
          ItemSeparatorComponent={() => (
            <View style={{ height: 5, backgroundColor: colors.gray }} />
          )}
          renderItem={renderPostSection}
          keyExtractor={(item) => item._id}
          extraData={posts}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
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

export async function generatePostsList(setPosts) {
  const gamersRef = collection(database, "gamers");
  const querySnapshot = await getDocs(gamersRef);

  const postsArray = [];
  for (const doc of querySnapshot.docs) {
    const data = doc.data();
    const postsRef = collection(database, `gamers/${doc.id}/posts`);
    const querySnapshotPosts = await getDocs(
      query(postsRef, orderBy("createdAt", "desc"))
    );

    for (const docPosts of querySnapshotPosts.docs) {
      const dataPosts = docPosts.data();
      if (docPosts.id === postsArray._id) return;
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
    }
  }
  setPosts(postsArray);
}
