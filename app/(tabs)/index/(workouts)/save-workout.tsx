import { FlatList, View, StyleSheet } from "react-native";
import { Appbar, Text, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import { useWorkout } from "@/context/WorkoutProvider";

const SaveWorkoutPage = () => {
  const router = useRouter();

  const { workout, setWorkout } = useWorkout();

  console.log(workout.exercises);

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

      {/* Render selected exercises */}
      {workout.exercises.length > 0 ? (
        <FlatList
          data={workout.exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.exerciseName}>
                  {index + 1}. {item.name}
                </Text>
                <Text style={styles.exerciseDetails}>{item.description}</Text>
              </Card.Content>
            </Card>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No exercises selected.</Text>
        </View>
      )}
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
});

export default SaveWorkoutPage;
