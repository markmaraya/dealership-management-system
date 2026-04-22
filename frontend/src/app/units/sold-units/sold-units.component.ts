import { environment } from 'environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormControl,
  FormGroupDirective,
  UntypedFormBuilder,
  UntypedFormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { io } from 'socket.io-client';
import { ApiService } from 'app/api.service';
import { Units } from 'app/models/units';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';

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
})
export class SoldUnitsComponent {
  socket = io(environment.apiUrl);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  salesForm: UntypedFormGroup;
  unitsForm: UntypedFormGroup;
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

    this.socket.on(
      'update-data',
      function (data: any) {
        this.getUnits();
      }.bind(this),
    );

    this.initForm();
  }

  getUnits() {
    this.api.getUnits().subscribe(
      (res: any) => {
        let getFilteredUnits = (res) => res.status == 'sold';
        let filteredRes: Units[] = res.filter(getFilteredUnits);

        this.data = new MatTableDataSource<Units>(filteredRes);
        this.data.paginator = this.paginator;
        this.data.sort = this.sort;
        if (this.salesForm.value.searchWord) {
          this.applyFilter(
            this.salesForm.value.searchWord,
            this.salesForm.value.searchBy,
          );
        }
        console.log(this.data);
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
    this.data.filterPredicate = (data: any, filter: string) => {
      switch (searchBy) {
        case 'unitCode':
          return data.unitCode.indexOf(filter) != -1;
          break;
        case 'makeAndModel':
          return data.makeAndModel.indexOf(filter) != -1;
          break;
        case 'bodyType':
          return data.bodyType.indexOf(filter) != -1;
          break;
        case 'chasisCode':
          return data.chasisCode.indexOf(filter) != -1;
          break;

        default:
          if (data.unitCode.indexOf(filter) != -1) {
            return data.unitCode.indexOf(filter) != -1;
          } else if (data.makeAndModel.indexOf(filter) != -1) {
            return data.makeAndModel.indexOf(filter) != -1;
          } else if (data.bodyType.indexOf(filter) != -1) {
            return data.bodyType.indexOf(filter) != -1;
          } else if (data.chasisCode.indexOf(filter) != -1) {
            return data.chasisCode.indexOf(filter) != -1;
          }
          break;
      }
    };
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
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
