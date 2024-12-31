import React, { useEffect, useState } from "react";
import { SectionList, StyleSheet, View, Keyboard } from "react-native";
import {
  Text,
  Card,
  Appbar,
  Searchbar,
  Button,
  IconButton,
} from "react-native-paper";

// Import the Exercise type and JSON data
import { Exercise } from "@/types/exercise";
import exercisesData from "@/assets/data/exercises.json";
import * as FileSystem from "expo-file-system";
import { Workout } from "@/types/workout";
import { useRouter } from "expo-router";
import { useWorkout } from "@/context/WorkoutProvider";

// Define Section Type
type Section = {
  title: string;
  data: Exercise[];
};

const CreateWorkoutPage = () => {
  const { workout, setWorkout } = useWorkout(); // Access workout context

  // State to manage exercises and selected exercises
  const [_, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [sectionedExercises, setSectionedExercises] = useState<Section[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBarFocused, setSearchBarFocused] = useState(false);

  const workoutsPath = FileSystem.documentDirectory + "workouts.json";
  // console.log(workoutsPath);

  const router = useRouter();

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

  useEffect(() => {
    if (!searchQuery.trim()) {
      // If the search query is empty, reset to original sections
      setSectionedExercises(() => {
        const sortedExercises = [...exercisesData].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        const groupedByLetter = sortedExercises.reduce<
          Record<string, Exercise[]>
        >((acc, exercise) => {
          const letter = exercise.name[0].toUpperCase();
          if (!acc[letter]) acc[letter] = [];
          acc[letter].push(exercise);
          return acc;
        }, {});

        const originalSections = Object.keys(groupedByLetter)
          .sort()
          .map((letter) => ({
            title: letter,
            data: groupedByLetter[letter],
          }));

        return originalSections;
      });
    } else {
      // Filter sections based on the search query
      const filteredSections = sectionedExercises
        .map((section) => ({
          ...section,
          data: section.data.filter((exercise) =>
            exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((section) => section.data.length > 0); // Remove empty sections

      setSectionedExercises(filteredSections);
    }
  }, [searchQuery]);

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
    setWorkout((prevWorkout) => ({ ...prevWorkout, exercises: [] }));
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

  // const navigateToDetails = () => {
  //   // Serialize selectedExercises for the query string
  //   const serializedData = encodeURIComponent(
  //     JSON.stringify(selectedExercises)
  //   );
  //   router.push(`./save-workout?exercises=${serializedData}`);
  // };

  const handleNext = () => {
    // Update global workout context with selected exercises
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      exercises: selectedExercises, // Save selected exercises to the context
    }));

    // Navigate to the next page
    router.push("./save-workout");
  };

  return (
    <View style={styles.container}>
      {/* Top App Bar with Clear Selection Button */}
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            router.back();
          }}
        />
        <Appbar.Content title="Select Exercises" />
        {selectedExercises.length > 0 && (
          <IconButton icon="trash-can-outline" onPress={clearSelection} />
        )}
      </Appbar.Header>

      {/* Exercise List with Section Index */}
      <SectionList
        style={styles.exerciseList}
        contentInset={{ bottom: 72 }} // Ensures space for the FAB and tab bar
        keyboardShouldPersistTaps="handled" // Ensures taps work seamlessly
        sections={sectionedExercises}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => {
          const isSelected = selectedExercises.some((ex) => ex.id === item.id);
          return (
            <Card
              onPress={() => toggleExerciseSelection(item)}
              style={[styles.card, isSelected && styles.selectedCard]}
            >
              <Card.Content>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <Text style={styles.exerciseDescription}>
                  {item.description}
                </Text>
              </Card.Content>
            </Card>
          );
        }}
        ListHeaderComponent={
          // TODO: Remove focus from search bar on scroll
          <Searchbar
            style={styles.searchBar}
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
            onFocus={() => setSearchBarFocused(true)}
            onBlur={() => setSearchBarFocused(false)}
            autoCorrect={false}
          />
        }
        stickySectionHeadersEnabled
        onScroll={() => {
          if (searchBarFocused) {
            Keyboard.dismiss(); // Dismiss the keyboard when scrolling
            setSearchBarFocused(false); // Reset the focus state
          }
        }}
      />

      {selectedExercises.length > 0 && (
        <Button
          mode="contained"
          style={styles.floatingButton}
          // onPress={() => router.push("./save-workout")} // Replace with your route
          onPress={handleNext} // Replace with your route
          // onPress={() => console.log("Move to next screen", exercises)} // Replace with your route
        >
          {`Next (${selectedExercises.length})`}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
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
  searchBar: {
    margin: 16,
  },
  // listContent: {
  // },
  exerciseList: {
    // marginBottom: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  selectedItem: {
    fontSize: 16,
    // color: "#444",
    marginVertical: 2,
  },
  noSelectionText: {
    fontSize: 14,
    // color: "#aaa",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    // backgroundColor: "#f4f4f4",
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
    borderWidth: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  exerciseDescription: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default CreateWorkoutPage;
