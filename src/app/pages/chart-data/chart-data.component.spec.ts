import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ChartDataComponent } from './chart-data.component';
import { UtilsService } from '../../utils/utils.service';
import { By } from '@angular/platform-browser';
import { WorkoutsEnum } from '../../enum/enum';
import { WorkoutData } from '../../interface/interface';

@Component({
  template: `<app-chart-data [dataArray]="dataArray"></app-chart-data>`,
})
class TestHostComponent {
  dataArray: WorkoutData[] = [];
}

class MockUtilsService {
  camelCasePipe(val: string): string {
    return val; // Mock implementation
  }
}

describe('ChartDataComponent', () => {
  let component: ChartDataComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [ChartDataComponent],
      providers: [{ provide: UtilsService, useClass: MockUtilsService }],
    }).compileComponents();
  });

  beforeEach(() => {
    sessionStorage.clear(); // Clear sessionStorage before each test
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.debugElement.query(
      By.directive(ChartDataComponent)
    ).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default data', () => {
    expect(component.labels).toEqual([]);
    expect(component.datasets).toEqual([]);
  });

  it('should load data from sessionStorage', () => {
    const workoutData: WorkoutData = {
      id: 1,
      name: 'ritik yadav',
      workouts: [
        { type: WorkoutsEnum.CYCLING, minute: 60 },
        { type: WorkoutsEnum.RUNNING, minute: 30 },
      ],
      noOfWorkouts: 2,
      totalWorkOutMinutes: 90,
    };
    sessionStorage.setItem('chartData', JSON.stringify(workoutData));

    component.ngOnInit();

    expect(component.workoutData).toEqual(workoutData);
    expect(component.labels).toEqual([
      WorkoutsEnum.CYCLING,
      WorkoutsEnum.RUNNING,
    ]);
    expect(component.datasets[0].data).toEqual([60, 30]);
  });

  it('should create chart on view init', () => {
    spyOn(component, 'createChart');
    component.ngAfterViewInit();
    expect(component.createChart).toHaveBeenCalled();
  });
});
