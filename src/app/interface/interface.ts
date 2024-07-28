export interface WorkoutData {
  id: number;
  name: string;
  workouts: Workouts[];
  noOfWorkouts: number;
  totalWorkOutMinutes: number;
}
export interface Workouts {
  type: string;
  minute: number;
}
