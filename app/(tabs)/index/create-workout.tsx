import React, { useEffect, useState } from "react";
import { SafeAreaView, FlatList, StyleSheet, View } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { Exercise } from "@/types";
// Static import of exercises.json
import exercisesData from "../../../assets/data/exercises.json";

const CreateWorkoutPage = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    // Load exercises
    setExercises(exercisesData);
  }, []);

  // Function to handle exercise selection
  const toggleExerciseSelection = (exercise: Exercise) => {
    const isSelected = selectedExercises.some((ex) => ex.id === exercise.id);
    if (isSelected) {
      // Remove from selected exercises
      setSelectedExercises((prev) =>
        prev.filter((ex) => ex.id !== exercise.id)
      );
    } else {
      // Add to selected exercises
      setSelectedExercises((prev) => [...prev, exercise]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Workout</Text>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedExercises.some((ex) => ex.id === item.id);
          return (
            <Card style={[styles.card, isSelected && styles.selectedCard]}>
              <Card.Content>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <Text style={styles.exerciseDescription}>
                  {item.description}
                </Text>
              </Card.Content>
              <Card.Actions>
                <Button
                  mode={isSelected ? "contained" : "outlined"}
                  onPress={() => toggleExerciseSelection(item)}
                >
                  {isSelected ? "Remove" : "Add to Workout"}
                </Button>
              </Card.Actions>
            </Card>
          );
        }}
      />
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Selected Exercises: {selectedExercises.length}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 3,
  },
  selectedCard: {
    borderColor: "#4caf50",
    borderWidth: 2,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  exerciseDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  summary: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
    marginTop: 16,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateWorkoutPage;
