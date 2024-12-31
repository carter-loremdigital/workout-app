import { createContext, useContext, useState } from "react";
import { Exercise, Workout } from "@/types";

type WorkoutContextType = {
  workout: Workout;
  setWorkout: React.Dispatch<React.SetStateAction<Workout>>;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [workout, setWorkout] = useState<Workout>({
    id: "", // Unique identifier for the workout
    name: "", // Name of the workout routine
    exercises: [], // Array of exercises in this workout
  });

  return (
    <WorkoutContext.Provider value={{ workout, setWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = (): WorkoutContextType => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
};
