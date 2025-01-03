import React from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native";

import workouts from "../../../assets/data/workouts.json";

const StartWorkoutPage = () => {
  const router = useRouter();

  const renderWorkout = ({ item }: { item: any }) => (
    <View style={styles.workoutCard}>
      <Text style={styles.workoutName}>{item.name}</Text>
      <Text style={styles.workoutDetail}>Duration: {item.duration}</Text>
      <Text style={styles.workoutDetail}>Difficulty: {item.difficulty}</Text>
    </View>
  );

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            router.back();
          }}
        />
        <Appbar.Content title="Select Workout" />
      </Appbar.Header>
      {/* <Text variant="headlineLarge">Select a Workout</Text> */}
      <Text style={styles.title}>Workout List</Text>
      <FlatList
        data={workouts}
        renderItem={renderWorkout}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   button: {
//     marginTop: 16,
//   },
// });
const styles = StyleSheet.create({
  button: {
    marginTop: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  list: {
    paddingBottom: 16,
  },
  workoutCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  workoutDetail: {
    fontSize: 14,
    color: "#666",
  },
});

export default StartWorkoutPage;
