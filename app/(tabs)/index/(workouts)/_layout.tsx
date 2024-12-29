import React from "react";
import { Stack } from "expo-router";

export default function WorkoutsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Automatically detects all screens in this folder */}
      <Stack.Screen
        name="select-exercises"
        options={{ title: "Select Exercises" }} // Secondary screen
      />
      <Stack.Screen
        name="save-workout"
        options={{ title: "Save Workout" }} // Secondary screen
      />
    </Stack>
  );
}
