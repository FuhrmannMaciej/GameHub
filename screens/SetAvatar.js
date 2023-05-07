import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import colors from '../colors';
import { addDoc, collection } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';

export default function SetAvatar({ navigation }) {

  const route = useRoute();

const onHandleSignup = () => {
    if (email !== '' && password !== '') {
  createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          console.log('Sign Up success')
          createGamer(route)
            .then(() => {
              console.log('Gamer created');
              navigation.navigate("SetAvatar");
        })
        .catch((err) => Alert.alert("Sign Up error", err.message));
    })
  };
};
  
  return (
    <View style={styles.container}>
      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>GameHub</Text>
      <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
        <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}> Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.loginLink}>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLinkText}> login to GameHub</Text>
            </TouchableOpacity>
          </View>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    alignSelf: "center",
    paddingBottom: 44,
  },
  input: {
    backgroundColor: colors.mediumGray,
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
    width: "80%",
    alignSelf: "center",
  },
  button: {
    backgroundColor: colors.primaryDark,
    height: 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
    marginTop: 10,
  },
  loginLink: {
    marginTop: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  loginLinkText: {
    color: colors.graySignUp,
    fontWeight: "600",
    fontSize: 16,
  },
});

const createGamer = (route) => {
    return new Promise(async (resolve, reject) => {
      try {
        addDoc(collection(database, `gamers/${auth.currentUser.uid}`), {
          userId: auth.currentUser.uid,
          firstName: route.params.firstName,
          lastName: route.params.lastName,
          dateOfBirth: route.params.dateOfBirth,
        })
        .then(() => {
          resolve();
        })
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };