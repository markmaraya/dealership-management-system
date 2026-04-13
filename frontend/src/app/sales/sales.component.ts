import { environment } from '../../environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, FormGroupDirective, UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { UpperCasePipe, Location } from '@angular/common';
import { Router } from '@angular/router';
import { io } from "socket.io-client";
import { ApiService } from '../api.service';
import { Units } from '../units';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AddSalesComponent } from '../add-sales/add-sales.component';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  providers: [UpperCasePipe]
})
export class SalesComponent implements OnInit {
  socket = io(environment.apiUrl);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  salesForm: UntypedFormGroup;
  unitsForm: UntypedFormGroup;
  matcher = new MyErrorStateMatcher();
  displayedColumns: string[] = ['unitCode', 'image', 'makeAndModel', 'bodyType', 'chasisCode', 'actions'];
  data: any;
  isLoadingResults: boolean = true;  
  searchWord: any;
  searchBy: any;
  formOptions: UntypedFormGroup;
  hideRequiredControl = new UntypedFormControl(false);
  floatLabelControl = new UntypedFormControl('auto');
  tableState: any = {
    isSold: true,
    isTableColumnHidden: false,    
    tableToogleButtonText: 'Sold Units',
    tableLabelStatus: 'Available Units'
  };
  

  constructor(
    private api: ApiService,
    private fb: UntypedFormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private location:Location,
    private uppercasePipe: UpperCasePipe) {
    this.formOptions = fb.group({
      hideRequired: this.hideRequiredControl,
      floatLabel: this.floatLabelControl,
    });    
  }

  ngOnInit(): void {
    let status = history.state.status == 'sold' ? true : false;
    this.getUnits(status);

    this.socket.on('update-data', function (data: any) {
      this.getUnits();
    }.bind(this));

    this.initForm();
  }

  getUnits(isSold?: boolean) {  
    this.api.getUnits()
      .subscribe((res: any) => {      
        let getFilteredUnits = (res) => {
          if (isSold) {
            this.tableState = {
              isSold: false,
              isTableColumnHidden: true,              
              tableToogleButtonText: 'Available Units',
              tableLabelStatus: 'Sold Units'
            };
            return res.status == 'sold';
          } else {
            this.tableState = {
              isSold: true,
              isTableColumnHidden: false,              
              tableToogleButtonText: 'Sold Units',
              tableLabelStatus: 'Available Units'
            };
            return res.status != 'sold';
          }
        }

        let filteredRes: Units[] = res.filter(getFilteredUnits);

        this.data = new MatTableDataSource<Units>(filteredRes);
        this.data.paginator = this.paginator;
        this.data.sort = this.sort;
        if (this.salesForm.value.searchWord) {
          this.applyFilter(this.salesForm.value.searchWord, this.salesForm.value.searchBy);
        }
        console.log(this.data);
        this.isLoadingResults = false;
      }, err => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }

  initForm() {
    this.salesForm = this.fb.group({
      searchWord: [null, Validators.required],
      searchBy: null
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
    }
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.data.filter = filterValue;
  }

  onFormSubmit() {
    this.applyFilter(this.salesForm.value.searchWord, this.salesForm.value.searchBy);
  }

  clearSearch() {
    this.salesForm = new UntypedFormGroup({
      searchWord: new UntypedFormControl(''),
      searchBy: new UntypedFormControl(0)
    });
    this.salesForm.reset();
    this.getUnits(!this.tableState.isSold);
  }

  openDialog(id: any, unit: string) {
    const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Mark Unit as Sold',
        message: `Confirm unit "${this.uppercasePipe.transform(unit)}" as sold`
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.setStatusToSold(id);
      }
    });
  }

  encodeNewUnit() {
    this.dialog.open(AddSalesComponent);
  }

  private setStatusToSold(id: string): void {
    this.api.getUnitsById(id).subscribe((result: any) => {
      const status = 'sold';
      this.isLoadingResults = false;
      this.unitsForm = this.fb.group({
        unitCode: result.unitCode,
        makeAndModel: result.makeAndModel,
        bodyType: result.bodyType,
        chasisCode: result.chasisCode,
        status: status,
        expenses: result.expenses,
        imageFile: result.imageFile
      });
      
      this.api.updateUnits(id, this.unitsForm.value)
          .subscribe((res: any) => {
            this.isLoadingResults = false;
            this.socket.emit('updatedata', res);
            this.router.navigate(['/']);
          }, (err: any) => {
            console.log(err);
            this.isLoadingResults = false;
          }
          );
    });
  }
}
