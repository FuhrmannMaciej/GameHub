import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  LogBox,
} from "react-native";
import colors from "../colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";


export default function SignUpStepOne({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const onHandleSignup = () => {
    const dateOfBirthTimeStamp = dateOfBirth.getTime();
    navigation.navigate("SignUpStepTwo", { 
      firstName, 
      lastName, 
      dateOfBirth: dateOfBirthTimeStamp });
  };

  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === "ios");
    setDateOfBirth(currentDate);
    setShowPlaceholder(false);
  };

  const showMode = () => {
    setShowDatePicker(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>GameHub</Text>
        <TextInput
          style={styles.input}
          placeholder="first name"
          autoCapitalize="words"
          textContentType="name"
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
        <TouchableOpacity style={styles.input} onPress={showMode}>
          {!showPlaceholder && dateOfBirth && (
            <Text style={{ color: colors.black, fontSize: 15, marginTop: 5 }}>
              {dateOfBirth.toLocaleDateString()}
            </Text>
          )}
            {showPlaceholder && (
            <Text style={{ color: colors.darkGrey, fontSize: 15, marginTop: 5 }}>
            date of birth
            </Text>
          )}
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="default"
              onChange={onChange}
              dateFormat="day month year"
              minimumDate={new Date(1900, 1, 1)}
              maximumDate={new Date()}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
          <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>
            {" "}
            Next
          </Text>
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
