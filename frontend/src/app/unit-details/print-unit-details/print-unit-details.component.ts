import { environment } from '../../../environments/environment';
import { Component, Input } from '@angular/core';
import { Units } from '../../models/units';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-print-unit-details',
  templateUrl: './print-unit-details.component.html',
  styleUrls: ['./print-unit-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    DecimalPipe,
    DatePipe,
  ],
})
export class PrintUnitDetailsComponent {
  @Input() units!: Units;
  @Input() showExpenses: number = 0;
  @Input() total: number = 0;

  environmentApiUrl = environment.apiUrl;
  printDisplayedColumns: string[] = [
    'amount',
    'description',
    'encodedBy',
    'dateEncoded',
  ];
}
