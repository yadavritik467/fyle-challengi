import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { UtilsService } from '../../utils/utils.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WorkoutData } from '../../interface/interface';
import { WorkoutsEnum } from '../../enum/enum';
import { of } from 'rxjs';
import { Router } from '@angular/router';

class MockUtilsService {
  camelCasePipe(val: string): string {
    return val; // Mock implementation
  }
}

class MockRouter {
  navigateByUrl(url: string) {
    return of(true);
  }
}

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let mockRouter: MockRouter; 

  beforeEach(async () => {
    mockRouter = new MockRouter();
    await TestBed.configureTestingModule({
      imports: [
        TableComponent,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: UtilsService, useClass: MockUtilsService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default data', () => {
    expect(component.displayedColumns).toEqual([
      'id',
      'name',
      'workouts',
      'noOfWorkouts',
      'totalWorkOutMinutes',
    ]);
    expect(component.dataSource).toBeTruthy();
  });

  it('should update dataSource when tableData changes', () => {
    const mockData: WorkoutData[] = [
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
    component.tableData = mockData;
    component.ngOnChanges({
      tableData: {
        currentValue: mockData,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.dataSource.data).toEqual(mockData);
  });

  it('should filter data correctly', () => {
    const mockData = [
      {
        id: 1,
        name: 'John',
        workouts: [],
        noOfWorkouts: 2,
        totalWorkOutMinutes: 60,
      },
      {
        id: 2,
        name: 'Jane',
        workouts: [{ type: 'Running' }],
        noOfWorkouts: 3,
        totalWorkOutMinutes: 90,
      },
    ];
    component.tableData = mockData;
    component.ngOnChanges({
      tableData: {
        currentValue: mockData,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    component.applyFilter({ target: { value: 'Jane' } } as unknown as Event);
    expect(component.dataSource.filteredData).toEqual([mockData[1]]);

    component.applyFilter({ target: { value: 'John' } } as unknown as Event);
    expect(component.dataSource.filteredData).toEqual([mockData[0]]);
  });

  it('should set filter to empty string when selecting "ALL"', () => {
    const matSelectChange: MatSelectChange = {
      value: WorkoutsEnum.ALL,
    } as MatSelectChange;
    component.onSelectionChange(matSelectChange);
    expect(component.dataSource.filter).toBe('');
  });

  it('should set filter to selected value', () => {
    const selectedValue = 'Running';
    const matSelectChange: MatSelectChange = {
      value: selectedValue,
    } as MatSelectChange;
    component.onSelectionChange(matSelectChange);
    expect(component.dataSource.filter).toBe(selectedValue);
  });

  it('should navigate to "/chart" and set session storage', () => {
    const workoutData: WorkoutData = {
      id: 1,
      name: 'Test Workout',
      workouts: [],
      noOfWorkouts: 1,
      totalWorkOutMinutes: 30,
    };

    spyOn(sessionStorage, 'setItem');
    spyOn(mockRouter, 'navigateByUrl').and.callThrough();

    component.navigateUrl(workoutData);

    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'chartData',
      JSON.stringify(workoutData)
    );
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/chart');
  });
});
