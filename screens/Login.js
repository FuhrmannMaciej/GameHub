import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import colors from "../colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onHandleLogin = () => {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {console.log("Login success");
        navigation.navigate("Home");})
        .catch((err) => Alert.alert("Login error", err.message));
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <View>
        <SafeAreaView>
          <Text style={styles.title}>GameHub</Text>
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
          <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
            <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>
              {" "}
              Log In
            </Text>
          </TouchableOpacity>
          <View style={styles.signUpLink}>
            <TouchableOpacity onPress={() => navigation.navigate("SignUpStepOne")}>
              <Text style={styles.signUpLinkText}> sign up for GameHub</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
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
  signUpLink: {
    marginTop: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  signUpLinkText: {
    color: colors.graySignUp,
    fontWeight: "600",
    fontSize: 16,
  },
});
