import React from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import workouts from "../../../assets/data/workouts.json";

const WorkoutsPage = () => {
  const renderWorkout = ({ item }: { item: any }) => (
    <View style={styles.workoutCard}>
      <Text style={styles.workoutName}>{item.name}</Text>
      <Text style={styles.workoutDetail}>Duration: {item.duration}</Text>
      <Text style={styles.workoutDetail}>Difficulty: {item.difficulty}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Workout List</Text>
      <FlatList
        data={workouts}
        renderItem={renderWorkout}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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

export default WorkoutsPage;
