import React, { useEffect, useState } from "react";
import { SectionList, StyleSheet, View, Keyboard } from "react-native";
import { Text, Card, Appbar, Searchbar, IconButton } from "react-native-paper";

// Import the Exercise type and JSON data
import { Exercise } from "@/types/exercise";
import exercisesData from "@/assets/data/exercises.json";
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
  const [sectionedExercises, setSectionedExercises] = useState<Section[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBarFocused, setSearchBarFocused] = useState(false);

  // console.log(workoutsPath);

  const router = useRouter();

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

  return (
    <View style={styles.container}>
      {/* Top App Bar with Clear Selection Button */}
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            router.back();
          }}
        />
        <Appbar.Content title="Exercises" />

        <IconButton icon="plus" size={28} />
      </Appbar.Header>

      {/* Exercise List with Section Index */}
      <SectionList
        contentInset={{ bottom: 72 }} // Ensures space for the FAB and tab bar
        keyboardShouldPersistTaps="handled" // Ensures taps work seamlessly
        sections={sectionedExercises}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => {
          return (
            <Card style={[styles.card]}>
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
    marginVertical: 2,
  },
  noSelectionText: {
    fontSize: 14,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 8,
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 3,
    marginHorizontal: 16,
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
