import { Exercise } from "./exercise";

export type Workout = {
  id: string; // Unique identifier for the workout
  name: string; // Name of the workout routine
  exercises: Exercise[]; // Array of exercises in this workout
  duration?: number; // Optional total duration in seconds
  createdAt: Date; // Date the workout was created
  updatedAt?: Date; // Optional date for the last update
};
