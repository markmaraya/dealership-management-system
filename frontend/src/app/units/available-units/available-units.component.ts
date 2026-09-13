import { environment } from '../../../environments/environment';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {
  UntypedFormControl,
  FormGroupDirective,
  UntypedFormBuilder,
  UntypedFormGroup,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UpperCasePipe, Location, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { io } from 'socket.io-client';
import { ApiService } from '../../api.service';
import { Units } from '../../models/units';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ErrorStateMatcher, MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { AddUnitsComponent } from '../../unit-details/add-units/add-units.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: UntypedFormControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-available-units',
  templateUrl: './available-units.component.html',
  styleUrls: ['./available-units.component.scss'],
  providers: [UpperCasePipe],
  standalone: true,
  imports: [    
    CommonModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    RouterLink,
    MatPaginatorModule,
  ],
})
export class AvailableUnitsComponent implements OnInit, AfterViewInit {
  socket = io(environment.apiUrl);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  salesForm!: UntypedFormGroup;
  unitsForm!: UntypedFormGroup;
  matcher = new MyErrorStateMatcher();
  displayedColumns: string[] = [
    'unitCode',
    'image',
    'makeAndModel',
    'bodyType',
    'chasisCode',
    'actions',
  ];
  data: any;
  isLoadingResults: boolean = true;
  searchWord: any;
  searchBy: any;
  formOptions: UntypedFormGroup;
  hideRequiredControl = new UntypedFormControl(false);
  floatLabelControl = new UntypedFormControl('auto');
  environmentApiUrl = environment.apiUrl;

  constructor(
    private api: ApiService,
    private fb: UntypedFormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private location: Location,
    private uppercasePipe: UpperCasePipe,
    public snackBar: MatSnackBar,
  ) {
    this.formOptions = fb.group({
      hideRequired: this.hideRequiredControl,
      floatLabel: this.floatLabelControl,
    });
  }

  ngOnInit(): void {
    this.getUnits();

    this.socket.on('update-data', (data: any) => {
      this.getUnits();
    });

    this.initForm();
  }

  ngAfterViewInit(): void {
    // Bind paginator and sort after the view is fully rendered
    if (this.data && this.paginator && this.sort) {
      this.data.paginator = this.paginator;
      this.data.sort = this.sort;
    }
  }

  getUnits() {
    this.api.getUnits().subscribe(
      (res: any) => {
        const filteredRes: Units[] = res.filter((item: Units) => item.status?.toLowerCase() === 'available');

        this.data = new MatTableDataSource<Units>(filteredRes);
        this.data.paginator = this.paginator;
        this.data.sort = this.sort;
        if (this.salesForm.value.searchWord) {
          this.applyFilter(
            this.salesForm.value.searchWord,
            this.salesForm.value.searchBy,
          );
        }

        this.isLoadingResults = false;
      },
      (err) => {
        console.log(err);
        this.isLoadingResults = false;
      },
    );
  }

  initForm() {
    this.salesForm = this.fb.group({
      searchWord: [null, Validators.required],
      searchBy: null,
    });
  }

  applyFilter(filterValue: string, searchBy?: any) {
    filterValue = (filterValue || '').trim().toLowerCase();

    this.data.filterPredicate = (data: any, filter: string) => {
      const searchTerms = filter.split(/\s+/);

      return searchTerms.every((term) => {
        switch (searchBy) {
          case 'unitCode':
            return data.unitCode.toLowerCase().includes(term);
          case 'makeAndModel':
            return data.makeAndModel.toLowerCase().includes(term);
          case 'bodyType':
            return data.bodyType.toLowerCase().includes(term);
          case 'chasisCode':
            return data.chasisCode.toLowerCase().includes(term);

          default:
            return (
              data.unitCode.toLowerCase().includes(term) ||
              data.makeAndModel.toLowerCase().includes(term) ||
              data.bodyType.toLowerCase().includes(term) ||
              data.chasisCode.toLowerCase().includes(term)
            );
        }
      });
    };

    this.data.filter = filterValue;
  }

  onFormSubmit() {
    this.applyFilter(
      this.salesForm.value.searchWord,
      this.salesForm.value.searchBy,
    );
  }

  clearSearch() {
    this.salesForm = new UntypedFormGroup({
      searchWord: new UntypedFormControl(''),
      searchBy: new UntypedFormControl(0),
    });
    this.salesForm.reset();
    this.getUnits();
  }

  openMarkAsSoldDialog(id: any, unit: string) {
    const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Mark Unit as Sold',
        message: `Confirm unit "${this.uppercasePipe.transform(unit)}" as sold?`,
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.setStatusToSold(id);
      }
    });
  }

  addNewUnit() {
    this.dialog.open(AddUnitsComponent);
  }

  private setStatusToSold(id: string): void {
    this.api.getUnitsById(id).subscribe((result: any) => {
      const status = 'Sold';
      this.isLoadingResults = false;
      this.unitsForm = this.fb.group({
        unitCode: result.unitCode,
        makeAndModel: result.makeAndModel,
        bodyType: result.bodyType,
        chasisCode: result.chasisCode,
        status: status,
        expenses: result.expenses,
        imageFile: result.imageFile,
      });

      this.api.updateUnits(id, this.unitsForm.value).subscribe(
        (res: any) => {
          this.isLoadingResults = false;
          this.socket.emit('updatedata', res);
          this.snackBar.open(
            `Unit ${result.unitCode} marked as sold successfully`,
            'Close',
            { duration: 5000 },
          );
          this.getUnits();
          this.router.navigate(['/']);
        },
        (err: any) => {
          console.log(err);
          this.isLoadingResults = false;
          this.snackBar.open('Error marking unit as sold', 'Close', {
            duration: 3000,
          });
        },
      );
    });
  }
}
