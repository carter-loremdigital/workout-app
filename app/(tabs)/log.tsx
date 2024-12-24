import React from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import workoutLogs from "../../assets/data/workoutLogs.json";

const WorkoutLogPage = () => {
  const renderWorkoutLog = ({ item }: { item: any }) => (
    <View style={styles.logCard}>
      <Text style={styles.logDate}>{item.date}</Text>
      <Text style={styles.logWorkout}>Workout: {item.workout}</Text>
      <Text style={styles.logDetail}>Duration: {item.duration}</Text>
      <Text style={styles.logDetail}>
        Calories Burned: {item.caloriesBurned} kcal
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Workout Log</Text>
      <FlatList
        data={workoutLogs}
        renderItem={renderWorkoutLog}
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
  logCard: {
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
  logDate: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  logWorkout: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  logDetail: {
    fontSize: 14,
    color: "#666",
  },
});

export default WorkoutLogPage;
