import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";

const StartWorkoutPage = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge">Select a Workout</Text>
      <Button
        mode="contained"
        // onPress={() => router.push("/home/workout-details")}
        style={styles.button}
      >
        Go to Workout Details
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default StartWorkoutPage;
