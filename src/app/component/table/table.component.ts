import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { WorkoutsEnum } from '../../enum/enum';
import { UtilsService } from '../../utils/utils.service';
import { FormsModule } from '@angular/forms';
import { WorkoutData } from '../../interface/interface';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    RouterOutlet,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnChanges, OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @Input() tableData: Array<any> | undefined;
  displayedColumns: string[] = [
    'id',
    'name',
    'workouts',
    'noOfWorkouts',
    'totalWorkOutMinutes',
  ];
  dataSource!: MatTableDataSource<any>;

  workoutsOpt = WorkoutsEnum;

  constructor(
    private readonly utilsService: UtilsService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.tableData);
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData']) {
      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.filterPredicate = this.createFilter();
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    }
  }

  camelCasePipe(val: string): string {
    return this.utilsService.camelCasePipe(val);
  }

  createFilter(): (data: any, filter: string) => boolean {
    return (data: any, filter: string): boolean => {
      const transformedFilter = filter.trim().toLowerCase();

      const matchId = data.id.toString().includes(transformedFilter);
      const matchName = data.name.toLowerCase().includes(transformedFilter);
      const matchNoOfWorkouts = data.noOfWorkouts
        .toString()
        .includes(transformedFilter);
      const matchWorkoutType = data.workouts.some((workout: any) =>
        workout.type.toLowerCase().includes(transformedFilter)
      );

      return matchId || matchName || matchNoOfWorkouts || matchWorkoutType;
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSelectionChange(selectedValue: MatSelectChange) {
    if (selectedValue.value === this.workoutsOpt.ALL) {
      this.dataSource.filter = ''; // Show all data
    } else {
      this.dataSource.filter = selectedValue.value;
    }
  }

  navigateUrl(ele: WorkoutData) {
    sessionStorage.setItem('chartData', JSON.stringify(ele));
    this.router.navigateByUrl(`/chart`);
  }
}
