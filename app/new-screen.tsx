import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";

const NewScreen = () => {
  return (
    <Text variant="headlineLarge" style={styles.title}>
      Select Workout
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5", // Light gray background
  },
  title: {
    marginBottom: 32,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    marginBottom: 16,
    width: "80%", // Adjust width as needed
  },
});

export default NewScreen;
