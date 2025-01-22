import { Exercise } from "./exercise";

export type Workout = {
  id: string; // Unique identifier for the workout
  name: string; // Name of the workout routine
  exercises: Exercise[]; // Array of exercises in this workout
  duration?: number; // Optional total duration in seconds
  createdAt?: string; // Date the workout was created
  updatedAt?: string; // Optional date for the last update
};
