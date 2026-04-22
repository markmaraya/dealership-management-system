import { environment } from 'environments/environment';
import { Component, Input } from '@angular/core';
import { Units } from 'app/models/units';

@Component({
  selector: 'app-print-unit-details',
  templateUrl: './print-unit-details.component.html',
  styleUrls: ['./print-unit-details.component.scss'],
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
