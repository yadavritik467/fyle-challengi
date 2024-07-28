import { WorkoutsEnum } from '../../enum/enum';
import { WorkoutData } from '../../interface/interface';

export const workoutData: WorkoutData[] = [
  {
    id: 1,
    name: 'john doe',
    workouts: [
      {
        type: WorkoutsEnum.RUNNING,
        minute: 30,
      },
      {
        type: WorkoutsEnum.CYCLING,
        minute: 45,
      },
    ],
    noOfWorkouts: 2,
    totalWorkOutMinutes: 75,
  },
  {
    id: 2,
    name: 'jane smith',
    workouts: [
      {
        type: WorkoutsEnum.SWIMMING,
        minute: 60,
      },
      {
        type: WorkoutsEnum.RUNNING,
        minute: 20,
      },
    ],
    noOfWorkouts: 2,
    totalWorkOutMinutes: 80,
  },
  {
    id: 3,
    name: 'mike johnson',
    workouts: [
      {
        type: WorkoutsEnum.YOGA,
        minute: 50,
      },
      {
        type: WorkoutsEnum.CYCLING,
        minute: 40,
      },
    ],
    noOfWorkouts: 2,
    totalWorkOutMinutes: 90,
  },
];
