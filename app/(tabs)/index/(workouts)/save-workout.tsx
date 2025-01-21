import { FlatList, View, StyleSheet, Dimensions } from "react-native";
import { Appbar, Text, Card, Button, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { useWorkout } from "@/context/WorkoutProvider";
import { memo, useState } from "react";
// import DraggableFlatList, {
//   RenderItemParams,
// } from "react-native-draggable-flatlist";
import ReorderableList, {
  ReorderableListReorderEvent,
  reorderItems,
  useReorderableDrag,
} from "react-native-reorderable-list";

const screenHeight = Dimensions.get("screen").height;

const SaveWorkoutPage = () => {
  const [workoutTitle, setWorkoutTitle] = useState("");
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const router = useRouter();
  const { workout, setWorkout } = useWorkout();

  // console.log(workout.exercises);

  const [data, setData] = useState(workout.exercises); // Local state for draggable list

  const handleContentSizeChange = (
    contentWidth: number,
    contentHeight: number
  ) => {
    // Enable scrolling only if the content height exceeds the screen height
    setScrollEnabled(contentHeight > screenHeight / 2);
  };

  const handleReorder = ({ from, to }: ReorderableListReorderEvent) => {
    setData((currentData) => {
      const reordered = reorderItems(currentData, from, to);
      // Update global context
      setWorkout((prev) => ({ ...prev, exercises: reordered }));
      return reordered;
    });
  };

  const ExerciseCard = memo(
    ({ item }: { item: (typeof workout.exercises)[0] }) => {
      const drag = useReorderableDrag();

      return (
        <Card style={styles.card} onLongPress={drag}>
          <Card.Content>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text style={styles.exerciseDetails}>{item.description}</Text>
          </Card.Content>
        </Card>
      );
    }
  );

  const renderItem = ({ item }: { item: (typeof workout.exercises)[0] }) => (
    <ExerciseCard item={item} />
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
      </Appbar.Header>
      <TextInput
        label="Workout Name"
        value={workoutTitle}
        onChangeText={(workoutTitle) => setWorkoutTitle(workoutTitle)}
        style={styles.titleInput}
      />
      {/* Render selected exercises */}
      {data.length > 0 ? (
        <ReorderableList
          data={data}
          onReorder={handleReorder}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={handleContentSizeChange}
          contentInset={{ bottom: 72 }} // Ensures space for the FAB and tab bar
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No exercises selected.</Text>
        </View>
      )}
      <Button
        mode="contained"
        onPress={() => console.log("Workout Saved")}
        style={styles.floatingButton}
      >
        Save Workout
      </Button>
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
  floatingButton: {
    position: "absolute",
    bottom: 96, // Adjust as needed
    left: 16,
    right: 16,
    borderRadius: 24,
    elevation: 3,
    zIndex: 10,
  },
  titleInput: {
    margin: 16,
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
