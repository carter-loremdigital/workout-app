export type Exercise = {
  id: string; // Unique identifier for the exercise
  name: string; // Name of the exercise
  description?: string; // Optional description of the exercise
  muscleGroups: string[]; // List of muscle groups targeted (e.g., ["chest", "triceps"])
  duration?: number; // Optional duration in seconds for timed exercises
  repetitions?: number; // Optional number of repetitions for rep-based exercises
};
