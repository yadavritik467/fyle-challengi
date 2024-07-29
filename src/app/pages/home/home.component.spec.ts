import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { UtilsService } from '../../utils/utils.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { workoutData } from './workout.data';
import { WorkoutsEnum } from '../../enum/enum';

class MockToastrService {
  success(message: string) {}
  error(message: string) {}
}

class MockUtilsService {
  camelCasePipe(val: string): string {
    return val; // Mock implementation
  }
  showError(msg: string) {}
  showSuccess(msg: string) {}
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockUtilsService: MockUtilsService;

  beforeEach(async () => {
    mockUtilsService = new MockUtilsService();
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
      ],
      providers: [
        UtilsService,
        { provide: ToastrService, useClass: MockToastrService },
        { provide: UtilsService, useValue: mockUtilsService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set userWorkOutDetails from localStorage if data is present', () => {
    const mockData = [
      {
        id: 1,
        name: 'John Doe',
        workouts: [],
        noOfWorkouts: 2,
        totalWorkOutMinutes: 60,
      },
    ];

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockData));
    component.getDataFromLocalStorage();

    expect(component.userWorkOutDetails).toEqual(mockData);
  });

  it('should set userWorkOutDetails to default workoutData if localStorage is empty', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    component.getDataFromLocalStorage();

    expect(component.userWorkOutDetails).toEqual(workoutData);
  });

  it('should have an invalid form when empty', () => {
    expect(component.formGroup.valid).toBeFalsy();
  });

  it('should not proceed if the form is invalid', () => {
    spyOn(component, 'onSubmitWorkoutDetails').and.callThrough();
    component.formGroup.controls['name'].setValue('');
    component.formGroup.controls['workoutType'].setValue('Running');
    component.formGroup.controls['minute'].setValue('30');

    component.onSubmitWorkoutDetails();

    expect(component.invalid).toBeTrue();
  });

  it('should add a new user if the user does not exist', () => {
    spyOn(localStorage, 'setItem');
    spyOn(mockUtilsService, 'showSuccess');

    // Prepare the component with initial values
    component.userWorkOutDetails = []; // Make sure the array is empty
    component.formGroup.setValue({
      name: 'John Doe',
      workoutType: 'Running',
      minute: '30',
    });

    // Call the method under test
    component.onSubmitWorkoutDetails();

    // Verify that a new user was added
    expect(component.userWorkOutDetails.length).toBe(1); // Checking for 1 new user

    const newUser = component.userWorkOutDetails[0];
    expect(newUser.name).toBe('john doe'); // Ensure name is properly normalized
    expect(newUser.workouts).toEqual([{ type: 'Running', minute: 30 }]);
    expect(newUser.totalWorkOutMinutes).toBe(30);
    expect(newUser.noOfWorkouts).toBe(1);

    // Verify that localStorage.setItem was called with the correct parameters
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'workOutData',
      JSON.stringify(component.userWorkOutDetails)
    );

    // Verify that showSuccess was called with the correct message
    expect(mockUtilsService.showSuccess).toHaveBeenCalledWith(
      'Workout added successfully'
    );
  });

  it('should update existing user workouts if user exists', () => {
    // Setup: mock data and form values
    const mockUserData = [
      {
        id: 1,
        name: 'john doe',
        workouts: [{ type: 'Running', minute: 30 }],
        noOfWorkouts: 1,
        totalWorkOutMinutes: 30,
      },
    ];
    component.userWorkOutDetails = mockUserData;
    component.formGroup.setValue({
      name: 'john doe',
      workoutType: 'Cycling',
      minute: 45,
    });

    // Call the method
    component.onSubmitWorkoutDetails();

    // Expected data
    const expectedData = [
      {
        id: 1,
        name: 'john doe',
        workouts: [
          { type: 'Running', minute: 30 },
          { type: 'Cycling', minute: 45 },
        ],
        noOfWorkouts: 2,
        totalWorkOutMinutes: 75,
      },
    ];

    // Assertions
    expect(component.userWorkOutDetails).toEqual(expectedData);
  });

  it('should show error and return the user if workout type already exists', () => {
    // Setup: mock data and form values
    const mockUserData = [
      {
        id: 1,
        name: 'john doe',
        workouts: [{ type: 'Running', minute: 30 }],
        noOfWorkouts: 1,
        totalWorkOutMinutes: 30,
      },
    ];
    component.userWorkOutDetails = mockUserData;
    component.formGroup.setValue({
      name: 'john doe',
      workoutType: 'Running',
      minute: 45,
    });

    // Spy on utilsService.showError method
    const showErrorSpy = spyOn(mockUtilsService, 'showError').and.callThrough();

    // Call the method
    component.onSubmitWorkoutDetails();

    // Expected data
    const expectedData = [
      {
        id: 1,
        name: 'john doe',
        workouts: [{ type: 'Running', minute: 30 }],
        noOfWorkouts: 1,
        totalWorkOutMinutes: 30,
      },
    ];

    // Assertions
    expect(component.userWorkOutDetails).toEqual(expectedData);
    expect(showErrorSpy).toHaveBeenCalledWith('Workout type already exists');
  });

  it('should add a new workout type if it does not already exist', () => {
    // Setup: mock data and form values
    const mockUserData = [
      {
        id: 1,
        name: 'john doe',
        workouts: [{ type: 'Running', minute: 30 }],
        noOfWorkouts: 1,
        totalWorkOutMinutes: 30,
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
    ];
    component.userWorkOutDetails = mockUserData;
    component.formGroup.setValue({
      name: 'john doe',
      workoutType: 'Cycling', // New workout type
      minute: 45,
    });

    // Spy on utilsService methods
    spyOn(mockUtilsService, 'showError').and.callThrough();

    // Call the method
    component.onSubmitWorkoutDetails();

    // Expected data with new workout type added
    const expectedData = [
      {
        id: 1,
        name: 'john doe',
        workouts: [
          { type: 'Running', minute: 30 },
          { type: 'Cycling', minute: 45 },
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
    ];

    // Assertions
    expect(component.userWorkOutDetails).toEqual(expectedData);
    expect(mockUtilsService.showError).not.toHaveBeenCalled();
  });

  it('should reset the form and clear errors after successful submission', () => {
    spyOn(localStorage, 'setItem');
    spyOn(mockUtilsService, 'showSuccess').and.callThrough();

    // Prepare the component with initial values
    component.userWorkOutDetails = [];
    component.formGroup.setValue({
      name: 'John Doe',
      workoutType: 'Running',
      minute: '30',
    });

    // Call the method under test
    component.onSubmitWorkoutDetails();

    // Verify that localStorage.setItem was called with correct parameters
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'workOutData',
      JSON.stringify(component.userWorkOutDetails)
    );

    // Verify that showSuccess was called with the correct message
    expect(mockUtilsService.showSuccess).toHaveBeenCalledWith(
      'Workout added successfully'
    );

    // Verify that the form is reset (controls should have empty values)
    expect(component.formGroup.controls['name'].value).toBe(null);
    expect(component.formGroup.controls['workoutType'].value).toBe(null);
    expect(component.formGroup.controls['minute'].value).toBe(null);

    // Verify that all form controls have no errors
    Object.keys(component.formGroup.controls).forEach((key) => {
      const control = component.formGroup.controls[key];
      expect(control.errors).toBeNull();
    });
  });
});
