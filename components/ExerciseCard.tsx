import React, { memo } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Card, IconButton } from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Exercise } from "@/types";
import { useReorderableDrag } from "react-native-reorderable-list";

type ExerciseCardProps = {
  exercise: Exercise;
  sets: number;
  reps: number;
  onUpdateSets: (sets: number) => void;
  onUpdateReps: (reps: number) => void;
  onDelete: () => void; // Function to delete the exercise
};

const ExerciseCard = memo(
  ({
    exercise,
    sets,
    reps,
    onUpdateSets,
    onUpdateReps,
    onDelete,
  }: ExerciseCardProps) => {
    const drag = useReorderableDrag();

    // Shared value for animation
    const height = useSharedValue(1); // 1 represents full height
    const opacity = useSharedValue(1); // 1 represents full opacity

    // Animated styles for opacity and height
    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ scaleY: height.value }],
    }));

    // Handle delete with animation
    const handleDelete = () => {
      // Animate opacity and height
      opacity.value = withTiming(0, { duration: 300 });
      height.value = withTiming(0, { duration: 300 }, (isFinished) => {
        if (isFinished) {
          runOnJS(onDelete)(); // Trigger the actual deletion after animation
        }
      });
    };

    // Render the delete button on swipe
    const renderRightActions = () => (
      <View style={styles.deleteContainer}>
        <IconButton
          icon="delete"
          size={24}
          onPress={handleDelete}
          //   color="white"
        />
      </View>
    );

    return (
      <Swipeable renderRightActions={renderRightActions}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Card onLongPress={drag}>
            <Card.Content>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseDetails}>{exercise.description}</Text>

              {/* Sets and Reps Counter */}
              <View style={styles.counterContainer}>
                {/* Sets Counter */}
                <View style={styles.counter}>
                  <Text style={styles.counterLabel}>Sets</Text>
                  <View style={styles.counterControls}>
                    <IconButton
                      icon="minus"
                      size={20}
                      onPress={() => onUpdateSets(Math.max(1, sets - 1))}
                    />
                    <Text style={styles.counterValue}>{sets}</Text>
                    <IconButton
                      icon="plus"
                      size={20}
                      onPress={() => onUpdateSets(sets + 1)}
                    />
                  </View>
                </View>

                {/* Reps Counter */}
                <View style={styles.counter}>
                  <Text style={styles.counterLabel}>Reps</Text>
                  <View style={styles.counterControls}>
                    <IconButton
                      icon="minus"
                      size={20}
                      onPress={() => onUpdateReps(Math.max(1, reps - 1))}
                    />
                    <Text style={styles.counterValue}>{reps}</Text>
                    <IconButton
                      icon="plus"
                      size={20}
                      onPress={() => onUpdateReps(reps + 1)}
                    />
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>
      </Swipeable>
    );
  }
);

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
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  exerciseDetails: {
    fontSize: 14,
    marginTop: 4,
    color: "#666",
  },
  counterContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  counter: {
    alignItems: "center",
    flex: 1,
  },
  counterLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  counterControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  counterValue: {
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 64,
  },
});

export default ExerciseCard;
