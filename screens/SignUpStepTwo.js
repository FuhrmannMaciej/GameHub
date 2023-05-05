import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import colors from '../colors';

export default function Signup({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const onHandleSignup = () => {
    if (email !== '' && password !== '') {
  createUserWithEmailAndPassword(auth, email, password)
        .then(() => console.log('Sign Up success'))
        .catch((err) => Alert.alert("Sign Up error", err.message));
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
        style={styles.input}
        placeholder="first name"
        autoCapitalize="words"
        textContentType="name"
        autoFocus={true}
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="last name"
        autoCapitalize="words"
        textContentType="familyName"
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />
         <TextInput
        style={styles.input}
        placeholder="email"
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
        textContentType="password"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
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