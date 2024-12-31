import { FlatList, View, StyleSheet } from "react-native";
import { Appbar, Text, Card, Button, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { useWorkout } from "@/context/WorkoutProvider";
import { useState } from "react";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";

const SaveWorkoutPage = () => {
  const [workoutTitle, setWorkoutTitle] = useState("");
  const router = useRouter();

  const { workout, setWorkout } = useWorkout();

  // console.log(workout.exercises);

  const [data, setData] = useState(workout.exercises); // Local state for draggable list

  const handleDragEnd = ({ data }: { data: typeof workout.exercises }) => {
    setData(data); // Update local order
    setWorkout((prev) => ({ ...prev, exercises: data })); // Update global context
  };

  const renderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<(typeof data)[0]>) => (
    <Card
      style={[
        styles.card,
        isActive && styles.activeCard, // Highlight the active item
      ]}
      onLongPress={drag} // Start drag on long press
    >
      <Card.Content>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseDescription}>{item.description}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View>
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
      />

      {/* Render selected exercises */}
      {workout.exercises.length > 0 ? (
        // <FlatList
        //   data={workout.exercises}
        //   keyExtractor={(item) => item.id}
        //   renderItem={({ item, index }) => (
        //     <Card style={styles.card}>
        //       <Card.Content>
        //         <Text style={styles.exerciseName}>
        //           {index + 1}. {item.name}
        //         </Text>
        //         <Text style={styles.exerciseDetails}>{item.description}</Text>
        //       </Card.Content>
        //     </Card>
        //   )}
        // />
        <DraggableFlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onDragEnd={handleDragEnd}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No exercises selected.</Text>
        </View>
      )}

      <Button
        mode="contained"
        onPress={() => console.log("Workout Saved")}
        // style={styles.button}
      >
        Save Workout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 3,
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
  // exerciseName: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  // },
  exerciseDescription: {
    fontSize: 14,
    marginTop: 4,
    color: "#666",
  },
});

export default SaveWorkoutPage;
