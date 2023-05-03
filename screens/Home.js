import React, { useEffect, useState, useCallback } from "react";
import { View, StatusBar, StyleSheet } from "react-native";
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
import { getDocs } from "firebase/firestore";

const Home = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MainHeaderLeft />,
      headerRight: () => <MainHeaderRight nav={navigation} />,
    });
      generatePostsList(setPosts);

      navigation.addListener("focus", () => {
        generatePostsList(setPosts);
      });

  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primaryDark} />
      <SecondHeader nav={navigation} />
      <NewPostSection nav={navigation} />
      <SafeAreaView style={styles.postSectionList}>
        <FlatList
          data={posts}
          ItemSeparatorComponent={() => (
            <View style={{ height: 5, backgroundColor: colors.gray }} />
          )}
          renderItem={({ item }) => (
            <PostSection
              username={item.firstName + " " + item.lastName}
              whenPosted={item.createdAt.toLocaleString()}
              textContent={item.textContent}
              imagePath={item.imagePath}
              likes={item.likes}
              comments={item.comments}
            />
          )}
          keyExtractor={(item) => item._id}
          extraData={posts}
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
    const querySnapshotPosts = await getDocs(query(postsRef, orderBy("createdAt", "desc")));

    for (const docPosts of querySnapshotPosts.docs) {
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
    }
  }

  setPosts(postsArray);
}


// export function generatePostsList(setPosts) {
//   const gamersRef = collection(database, "gamers");
//   const q = query(gamersRef);

//   const unsubscribe = onSnapshot(q, (querySnapshot) => {
//     const postsArray = [];
//     querySnapshot.forEach((doc) => {
//       const data = doc.data();
//       const postsRef = collection(database, `gamers/${doc.id}/posts`);
//       const q = query(postsRef, orderBy("createdAt", "desc"));
//       onSnapshot(q, (querySnapshotPosts) => {
//         querySnapshotPosts.forEach((docPosts) => {
//           const dataPosts = docPosts.data();
//           if (docPosts.id === postsArray._id) return;
//           postsArray.push({
//             _id: docPosts.id,
//             firstName: data.firstName,
//             lastName: data.lastName,
//             textContent: dataPosts.textContent,
//             createdAt: dataPosts.createdAt.toDate(),
//             imagePath: dataPosts.imagePath,
//             likes: dataPosts.likes,
//             comments: dataPosts.comments,
//           });
//         });
//       });
//     });
//     setPosts(postsArray);
//   });

//   return () => {
//     unsubscribe();
//   };
// }
