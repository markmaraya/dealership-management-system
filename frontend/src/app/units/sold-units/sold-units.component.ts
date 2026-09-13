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
import { Location, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { io } from 'socket.io-client';
import { ApiService } from '../../api.service';
import { Units } from '../../models/units';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ErrorStateMatcher, MatOptionModule } from '@angular/material/core';
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
  selector: 'app-sold-units',
  templateUrl: './sold-units.component.html',
  styleUrls: ['./sold-units.component.scss'],
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
export class SoldUnitsComponent implements OnInit, AfterViewInit {
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
    if (this.data && this.paginator && this.sort) {
      this.data.paginator = this.paginator;
      this.data.sort = this.sort;
    }
  }

  getUnits() {
    this.api.getUnits().subscribe(
      (res: any) => {
        const filteredRes: Units[] = res.filter(
          (item: Units) => item.status?.toLowerCase() === 'sold',
        );

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
}
