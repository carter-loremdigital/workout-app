import React, { useState } from "react";
import { StyleSheet, Text, FlatList, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import { Card, Button, Dialog, Portal, Paragraph } from "react-native-paper";
import { Swipeable } from "react-native-gesture-handler";
import { Workout } from "../../../types/workout";
import { useFocusEffect } from "@react-navigation/native";

const workoutsPath = FileSystem.documentDirectory + "workouts.json";

const MyWorkoutsPage = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const loadWorkouts = async () => {
    try {
      const fileExists = await FileSystem.getInfoAsync(workoutsPath);

      if (fileExists.exists) {
        const data = await FileSystem.readAsStringAsync(workoutsPath);
        const savedWorkouts = JSON.parse(data) as Workout[];

        const sortedWorkouts = savedWorkouts.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        setWorkouts(sortedWorkouts);
      } else {
        console.log("No workouts file found. Initializing empty workouts.");
        setWorkouts([]);
      }
    } catch (error) {
      console.error("Error loading workouts:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadWorkouts();
    }, [])
  );

  const deleteWorkout = async (workoutId: string) => {
    try {
      const updatedWorkouts = workouts.filter(
        (workout) => workout.id !== workoutId
      );
      setWorkouts(updatedWorkouts);

      await FileSystem.writeAsStringAsync(
        workoutsPath,
        JSON.stringify(updatedWorkouts, null, 2)
      );
      Alert.alert("Workout deleted successfully.");
    } catch (error) {
      console.error("Error deleting workout:", error);
      Alert.alert("Failed to delete workout. Check console for details.");
    }
  };

  const handleDeletePress = (workout: Workout) => {
    setWorkoutToDelete(workout);
    setIsDialogVisible(true);
  };

  const confirmDelete = () => {
    if (workoutToDelete) {
      deleteWorkout(workoutToDelete.id);
    }
    setIsDialogVisible(false);
  };

  const renderRightActions = (workout: Workout) => (
    <View style={styles.swipeContainer}>
      <Button
        icon="delete"
        mode="contained"
        onPress={() => handleDeletePress(workout)}
        style={styles.deleteButton}
      >
        Delete
      </Button>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Workouts</Text>

      {workouts.length === 0 ? (
        <Text style={styles.noWorkoutsText}>No saved workouts yet!</Text>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item)}>
              <Card style={styles.card}>
                <Card.Content>
                  <Text style={styles.workoutName}>{item.name}</Text>
                  <Text style={styles.workoutDetails}>
                    Exercises: {item.exercises.length}
                  </Text>
                  <Text style={styles.workoutDetails}>
                    Created: {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </Card.Content>
              </Card>
            </Swipeable>
          )}
        />
      )}

      {/* Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={isDialogVisible}
          onDismiss={() => setIsDialogVisible(false)}
        >
          <Dialog.Title>Delete Workout</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to delete this workout? This action cannot
              be undone.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>Cancel</Button>
            <Button onPress={confirmDelete}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  noWorkoutsText: {
    fontSize: 18,
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 3,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  workoutDetails: {
    fontSize: 16,
    color: "#666",
  },
  swipeContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginVertical: 8,
  },
  deleteButton: {
    backgroundColor: "#d32f2f",
    borderRadius: 8,
    padding: 8,
    marginRight: 16,
  },
});

export default MyWorkoutsPage;
