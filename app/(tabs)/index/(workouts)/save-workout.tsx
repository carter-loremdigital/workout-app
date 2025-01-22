import {
  View,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
} from "react-native";
import {
  Appbar,
  Text,
  Card,
  Button,
  TextInput,
  IconButton,
  Title,
  Icon,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useWorkout } from "@/context/WorkoutProvider";
import { memo, useState } from "react";
import ExerciseCard from "@/components/ExerciseCard";

import ReorderableList, {
  NestedReorderableList,
  ReorderableListReorderEvent,
  reorderItems,
  ScrollViewContainer,
} from "react-native-reorderable-list";

const SaveWorkoutPage = () => {
  const [workoutTitle, setWorkoutTitle] = useState("");
  const router = useRouter();
  const { workout, setWorkout } = useWorkout();

  // console.log(workout.exercises);

  const [data, setData] = useState(
    workout.exercises.map((exercise) => ({
      ...exercise,
      sets: 3, // Default sets
      reps: 10, // Default reps
    }))
  );

  const handleReorder = ({ from, to }: ReorderableListReorderEvent) => {
    setData((currentData) => {
      const reordered = reorderItems(currentData, from, to);
      // Update global context
      setWorkout((prev) => ({ ...prev, exercises: reordered }));
      return reordered;
    });
  };

  // Handle deleting an exercise
  const handleDelete = (id: string) => {
    setData((currentData) => {
      const updatedData = currentData.filter((exercise) => exercise.id !== id);

      // Update the global state
      setWorkout((prevWorkout) => ({
        ...prevWorkout,
        exercises: updatedData, // Sync with the filtered data
      }));

      return updatedData; // Update local state
    });
  };

  const updateExercise = (id: string, key: "sets" | "reps", value: number) => {
    setData((currentData) =>
      currentData.map((exercise) =>
        exercise.id === id ? { ...exercise, [key]: value } : exercise
      )
    );
  };

  const renderItem = ({ item }: { item: (typeof data)[0] }) => (
    <ExerciseCard
      exercise={item}
      sets={item.sets}
      reps={item.reps}
      onUpdateSets={(sets) => updateExercise(item.id, "sets", sets)}
      onUpdateReps={(reps) => updateExercise(item.id, "reps", reps)}
      onDelete={() => handleDelete(item.id)} // Pass the delete handler
    />
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            router.back();
          }}
        />

        <Appbar.Content title="Save Workout" />

        {data.length > 0 && (
          <Button mode="text" onPress={() => console.log("Workout Saved!")}>
            Save
          </Button>
        )}
      </Appbar.Header>
      <ScrollViewContainer>
        <View>
          <Title>Workout Name</Title>
          <TextInput
            label="Workout Name"
            value={workoutTitle}
            onChangeText={(workoutTitle) => setWorkoutTitle(workoutTitle)}
            style={styles.titleInput}
          />
        </View>
        <View>
          <Title>Selected Exercises</Title>

          <Text>
            <Icon source="information-outline" size={16} />
            Drag and drop exercises to change the order of your workout. Adjust
            the number of sets and reps for each exercise using the + and -
            icons. Swipe left on an exercise to delete it.
          </Text>
        </View>
        {/* Render selected exercises */}
        {data.length > 0 ? (
          <NestedReorderableList
            style={styles.list}
            data={data}
            onReorder={handleReorder}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No exercises selected.</Text>
          </View>
        )}
      </ScrollViewContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 3,
  },
  titleInput: {
    margin: 16,
  },
  list: {
    paddingBottom: 96,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  exerciseDetails: {
    fontSize: 14,
    marginTop: 4,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#aaa",
  },
  activeCard: {
    backgroundColor: "#e0f7fa", // Highlight active item
  },

  exerciseDescription: {
    fontSize: 14,
    marginTop: 4,
    color: "#666",
  },
});

export default SaveWorkoutPage;
