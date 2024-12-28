import React from "react";
import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Automatically detects all screens in this folder */}
      <Stack.Screen
        name="index"
        options={{ title: "Home" }} // Main screen for this tab
      />
      <Stack.Screen
        name="start-workout"
        options={{ title: "Start Workout" }} // Secondary screen
      />
      <Stack.Screen
        name="create-workout"
        options={{ title: "Create Workout" }} // Secondary screen
      />
    </Stack>
  );
}
