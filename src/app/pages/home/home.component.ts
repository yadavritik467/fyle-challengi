import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TableComponent } from '../../component/table/table.component';
import { InputTrimDirective } from '../../directive/input-trim.directive';
import { WorkoutsEnum } from '../../enum/enum';
import { UtilsService } from '../../utils/utils.service';
import { workoutData } from './workout.data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    TableComponent,
    InputTrimDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  formGroup: FormGroup = new FormGroup({});
  workoutsOpt = WorkoutsEnum;
  userWorkOutDetails = workoutData;
  invalid: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly utilsService: UtilsService
  ) {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      workoutType: ['', Validators.required],
      minute: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getDataFromLocalStorage();
  }

  getDataFromLocalStorage() {
    const isLocalContainData = localStorage.getItem('workOutData');
    if (isLocalContainData) {
      this.userWorkOutDetails = JSON.parse(isLocalContainData);
    }
  }

  onSubmitWorkoutDetails() {
    this.invalid = true;

    if (this.formGroup.invalid) {
      return;
    } else {
      this.invalid = false;
      const values = this.formGroup.value;
      console.log(values?.name?.trim());
      const msg = 'Workout added successfully';
      const userExist = this.userWorkOutDetails.some(
        (user) =>
          this.utilsService.camelCasePipe(user?.name) ===
          this.utilsService.camelCasePipe(values?.name)
      );
      console.log(userExist);

      if (userExist) {
        this.userWorkOutDetails = this.userWorkOutDetails.map((user) => {
          if (
            this.utilsService.camelCasePipe(user?.name) ===
            this.utilsService.camelCasePipe(values?.name)
          ) {
            const workoutExists = user?.workouts?.some(
              (workout) => workout.type === values?.workoutType
            );

            if (workoutExists) {
              const errMsg = 'Workout type already exists';
              this.utilsService.showError(errMsg);
              return user;
            }

            const updatedWorkouts = [
              ...user.workouts,
              { type: values.workoutType, minute: Number(values.minute) },
            ];

            const totalWorkOutMinutes = updatedWorkouts.reduce(
              (acc, curr) => acc + curr.minute,
              0
            );
            const noOfWorkouts = updatedWorkouts.length;

            return {
              ...user,
              workouts: updatedWorkouts,
              totalWorkOutMinutes,
              noOfWorkouts,
            };
          }

          return user; // Return user without any changes
        });
      } else {
        this.userWorkOutDetails.push({
          id: this.userWorkOutDetails?.length + 1,
          name: values?.name?.trim()?.toLowerCase(),
          noOfWorkouts: 1,
          workouts: [
            { type: values?.workoutType, minute: Number(values?.minute) },
          ],
          totalWorkOutMinutes: Number(values?.minute),
        });
      }

      this.userWorkOutDetails = [...this.userWorkOutDetails];

      console.log(this.userWorkOutDetails);
      this.utilsService.showSuccess(msg);
    }
  }
}
