import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Title at the top */}
      <Text variant="headlineLarge" style={styles.title}>
        Workout Tracker
      </Text>

      {/* Buttons in the center */}
      <View style={styles.buttonContainer}>
        <Button
          icon="weight-lifter"
          mode="contained"
          // onPress={() => console.log("Button 1 Pressed")}
          onPress={() => router.push("/new-screen")}
          style={styles.button}
        >
          Start Workout
        </Button>
        <Button
          icon="plus"
          mode="outlined"
          onPress={() => console.log("Button 2 Pressed")}
          style={styles.button}
        >
          Create New Workout
        </Button>
      </View>
    </View>
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

export default HomeScreen;
