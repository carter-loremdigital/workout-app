import React from "react";
import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Automatically detects all screens in this folder */}
    </Stack>
  );
}
