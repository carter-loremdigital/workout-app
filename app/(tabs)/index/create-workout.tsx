import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  SectionList,
  StyleSheet,
  View,
  ScrollView,
} from "react-native";
import { Text, Card, Button, Appbar } from "react-native-paper";

// Import the Exercise type and JSON data
import { Exercise } from "../../../types/exercise";
import exercisesData from "../../../assets/data/exercises.json";
import * as FileSystem from "expo-file-system";
import { Workout } from "../../../types/workout";

// const workoutsPath = FileSystem.documentDirectory + "workouts.json";

// Define Section Type
type Section = {
  title: string;
  data: Exercise[];
};

const CreateWorkoutPage = () => {
  // State to manage exercises and selected exercises
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [sectionedExercises, setSectionedExercises] = useState<Section[]>([]);

  const workoutsPath = FileSystem.documentDirectory + "workouts.json";
  console.log(workoutsPath);

  useEffect(() => {
    // Sort exercises alphabetically and organize into sections by first letter
    const sortedExercises = [...exercisesData].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    // Define the type for the grouped object
    const groupedByLetter = sortedExercises.reduce<Record<string, Exercise[]>>(
      (acc, exercise) => {
        const letter = exercise.name[0].toUpperCase();
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(exercise);
        return acc;
      },
      {} // Initial value
    );

    // Convert grouped object into sections
    const sections = Object.keys(groupedByLetter)
      .sort()
      .map((letter) => ({
        title: letter,
        data: groupedByLetter[letter],
      }));

    setExercises(sortedExercises);
    setSectionedExercises(sections);
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

  // Function to clear all selected exercises
  const clearSelection = () => {
    setSelectedExercises([]);
  };

  const saveWorkout = async () => {
    if (selectedExercises.length === 0) {
      alert("Please select at least one exercise.");
      return;
    }

    const newWorkout: Workout = {
      id: Date.now().toString(),
      name: `Workout ${new Date().toLocaleDateString()}`,
      exercises: selectedExercises,
      createdAt: new Date(),
      duration: selectedExercises.reduce((total, exercise) => {
        return total + (exercise.duration || 0);
      }, 0),
    };

    try {
      const fileExists = await FileSystem.getInfoAsync(workoutsPath);
      console.log(workoutsPath);
      let workouts: Workout[] = [];

      if (fileExists.exists) {
        // Read the existing file
        const data = await FileSystem.readAsStringAsync(workoutsPath);
        console.log("Existing Workouts Data:", data);
        workouts = JSON.parse(data) as Workout[];
      }

      // Append the new workout
      workouts.push(newWorkout);

      // Write the updated workouts array back to the file
      await FileSystem.writeAsStringAsync(
        workoutsPath,
        JSON.stringify(workouts, null, 2)
      );
      console.log("Workout saved successfully.");
      alert("Workout saved successfully!");
      setSelectedExercises([]); // Clear the selection after saving
    } catch (error) {
      console.error("Error saving workout:", error);
      alert("Failed to save workout. Check console for details.");
    }
  };

  return (
    <View>
      {/* style={styles.container}> */}
      {/* Top App Bar with Clear Selection Button */}
      <Appbar.Header>
        {selectedExercises.length > 0 && (
          <Button icon="trash-can-outline" mode="text" onPress={clearSelection}>
            Clear
          </Button>
        )}
        <Appbar.Content title="Create Workout" />
        {selectedExercises.length > 0 && (
          <Button icon="plus" mode="text" onPress={saveWorkout}>
            Save
          </Button>
        )}
      </Appbar.Header>

      {/* Selected Exercises Section */}
      <ScrollView style={styles.selectedContainer}>
        <Text style={styles.selectedTitle}>Selected Exercises:</Text>
        {selectedExercises.length > 0 ? (
          selectedExercises.map((exercise, index) => (
            <Text key={exercise.id} style={styles.selectedItem}>
              {index + 1}. {exercise.name}
            </Text>
          ))
        ) : (
          <Text style={styles.noSelectionText}>No exercises selected.</Text>
        )}
      </ScrollView>

      {/* Exercise List with Section Index */}
      <SectionList
        sections={sectionedExercises}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
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
        stickySectionHeadersEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // padding: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  selectedContainer: {
    marginBottom: 16,
    // maxHeight: 120,
    height: 240,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  selectedItem: {
    fontSize: 16,
    color: "#444",
    marginVertical: 2,
  },
  noSelectionText: {
    fontSize: 14,
    color: "#aaa",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#f4f4f4",
    padding: 8,
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 3,
    marginHorizontal: 16,
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
});

export default CreateWorkoutPage;
