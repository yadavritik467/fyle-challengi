import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { NgChartsModule } from 'ng2-charts';
import { WorkoutsEnum } from '../../enum/enum';
import { WorkoutData } from '../../interface/interface';
import { UtilsService } from '../../utils/utils.service';

interface DataSets {
  label: string;
  data: number[];
  backgroundColor: string[];
  barPercentage: number;
}
@Component({
  selector: 'app-chart-data',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './chart-data.component.html',
  styleUrl: './chart-data.component.scss',
})
export class ChartDataComponent implements OnInit, AfterViewInit {
  labels: string[] = [];
  datasets: DataSets[] = [];
  workoutData: WorkoutData | undefined;
  @Input({ required: true }) dataArray: WorkoutData[] = [];

  constructor(private readonly utilsService: UtilsService) {}

  ngOnInit(): void {
    const dataFromStorage = sessionStorage.getItem('chartData');
    if (dataFromStorage) {
      this.workoutData = JSON.parse(dataFromStorage) as WorkoutData;
      console.log('Data from sessionStorage:', this.workoutData);
      this.addDataInChart(this.workoutData);
    }
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  addDataInChart(workoutData: WorkoutData) {
    this.labels = workoutData?.workouts?.map((data) => data?.type);
    this.datasets = [
      {
        label: '',
        data: workoutData?.workouts?.map((data) => data?.minute),
        backgroundColor: ['#6a73fa'],
        barPercentage: 0.2,
      },
    ];
  }

  camelCasePipe(val: string): string {
    return this.utilsService.camelCasePipe(val);
  }

  createChart() {
    const ctx = document.getElementById('workoutChart') as HTMLCanvasElement;
    ctx.height = 100;
    const data = {
      labels: this.labels,
      datasets: this.datasets,
    };

    console.log(data);

    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
}
