import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Text, Button, Snackbar, Icon } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";

const HomeScreen = () => {
  const router = useRouter();
  // const navigation = useNavigation();

  const { success } = useLocalSearchParams(); // Retrieve query parameters
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (success === "true") {
      setSnackbarMessage("Workout saved successfully!");
      setSnackbarVisible(true);
    } else if (success === "false") {
      setSnackbarMessage("Failed to save workout.");
      setSnackbarVisible(true);
    }
  }, [success]);

  return (
    <View style={styles.container}>
      {/* Title at the top */}
      <Text variant="headlineLarge" style={styles.title}>
        Workout Tracker
      </Text>

      {/* Buttons in the center */}
      <View style={styles.buttonContainer}>
        <Button
          icon="weight-lifter"
          mode="contained"
          // onPress={() => console.log("Button 1 Pressed")}
          // onPress={() => navigation.navigate("/")}
          onPress={() => router.push("./(workouts)/start-workout")}
          style={styles.button}
        >
          Start Workout
        </Button>
        <Button
          icon="plus"
          mode="outlined"
          onPress={() => router.push("./(workouts)/select-exercises")}
          style={styles.button}
        >
          Create New Workout
        </Button>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        // onIconPress={() => {}}
        duration={3000}
        // icon="check"
        style={
          success === "true" ? styles.successSnackbar : styles.errorSnackbar
        }
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5", // Light gray background
  },
  title: {
    marginBottom: 32,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    marginBottom: 16,
    width: "80%", // Adjust width as needed
  },
  successSnackbar: {
    // backgroundColor: "green",
    marginBottom: 64,
  },
  errorSnackbar: {
    backgroundColor: "red",
    marginBottom: 49,
  },
});

export default HomeScreen;
