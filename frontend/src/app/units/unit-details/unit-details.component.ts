import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { DatePipe } from '@angular/common';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../api.service';
import { Units } from '../../models/units';
import { Gallery } from '../../models/gallery';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { SalesImageUploadComponent } from '../../sales-image-upload/sales-image-upload.component';
import { ImagePreviewDialogComponent } from '../../dialog/image-preview-dialog/image-preview-dialog.component';
import { AddExpensesComponent } from '../../add-expenses/add-expenses.component';
import { EditUnitDetailsComponent } from '../edit-unit-details/edit-unit-details.component';
import { EditExpensesComponent } from '../../edit-expenses/edit-expenses.component';

@Component({
  selector: 'app-unit-details',
  templateUrl: './unit-details.component.html',
  styleUrls: ['./unit-details.component.scss'],
})
export class UnitDetailsComponent implements OnInit {
  socket = io(environment.apiUrl);

  _id: any;
  gallery: Gallery = { id: '', imageUrl: '', uploaded: null, unitCode: '' };
  units: Units = {
    id: '',
    unitCode: '',
    makeAndModel: '',
    bodyType: '',
    chasisCode: '',
    status: '',
    expenses: [],
    imageFile: this.gallery,
  };
  displayedColumns: string[] = [
    'amount',
    'description',
    'encodedBy',
    'dateEncoded',
    'actions',
  ];
  printDisplayedColumns: string[] = [
    'amount',
    'description',
    'encodedBy',
    'dateEncoded',
  ];
  isLoadingResults = true;
  showExpenses = 0;
  total = 0;
  salesForm: UntypedFormGroup;
  environmentApiUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private clipboard: Clipboard,
    private datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
  ) {}

  ngOnInit(): void {
    this._id = this.route.snapshot.params.id;
    this.getUnitsDetails(this._id);

    this.socket.on(
      'update-data',
      function (data: any) {
        this.getUnitsDetails(this._id);
      }.bind(this),
    );
  }

  getUnitsDetails(id: string) {
    this.api.getUnitsById(id).subscribe((data: any) => {
      this.units = data;
      this.getExpenses(id);
      this.isLoadingResults = false;
    });
  }

  deleteUnits(id: any) {
    this.isLoadingResults = true;
    this.api.deleteUnits(id).subscribe(
      (res) => {
        this.isLoadingResults = false;
        this.router.navigate(
          res.status === 'sold'
            ? ['/units/sold-units']
            : ['/units/available-units'],
        );
      },
      (err) => {
        console.log(err);
        this.isLoadingResults = false;
      },
    );
  }

  getExpenses(id: string) {
    this.api.getExpensesByUnitCode(id).subscribe(
      (res: any) => {
        this.units.expenses = res;
        this.showExpenses = this.units.expenses.length;
        this.calculateTotal();
      },
      (err) => {
        console.log(err);
        this.isLoadingResults = false;
        this.showExpenses = 0;
      },
    );
  }

  openAddExpensesDialog(id: any, unitCode: string) {
    this.dialog.open(AddExpensesComponent, {
      data: {
        _id: id,
        unitCode: unitCode,
      },
    });
  }

  openUploadDialog(id: any) {
    const uploadDialog = this.dialog.open(SalesImageUploadComponent, {
      data: { _id: id },
    });
    uploadDialog.afterClosed().subscribe((result) => {
      if (this.route.snapshot.params.imgId) {
        this.isLoadingResults = true;
        this.salesForm = this.formBuilder.group({
          unitCode: [null, Validators.required],
          makeAndModel: [null, Validators.required],
          bodyType: [null, Validators.required],
          chasisCode: [null, Validators.required],
          expenses: null,
          imageFile: [null, Validators.required],
        });
        this.updateUnitAddImage(id, this.route.snapshot.params.imgId);
      }
    });
  }

  openEditUnitDialog(id: string) {
    this.dialog.open(EditUnitDetailsComponent, {
      data: { _id: id },
    });
  }

  openDeleteUnitDialog(id: any) {
    const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Remove Unit',
        message: `Are you sure, you want to remove unit ${this.units.unitCode}?`,
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteUnits(id);
      }
    });
  }

  openEditExpensesDialog(unitId: string, expenseId: string) {
    this.dialog.open(EditExpensesComponent, {
      data: {
        unitId: unitId,
        expensesId: expenseId,
      },
    });
  }

  openDialogDeleteExpenses(id: any) {
    const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Remove Expenses',
        message: 'Are you sure, you want to remove expenses',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteExpenses(id);
      }
    });
  }

  openImagePreviewDialog(id: any) {
    this.dialog.open(ImagePreviewDialogComponent, {
      data: { _id: id },
    });
  }

  deleteExpenses(id: any) {
    this.isLoadingResults = true;
    this.api.deleteExpenses(id).subscribe(
      (res) => {
        this.isLoadingResults = false;
        this.router.navigate(['/sales-details', this._id]);
        this.socket.emit('updatedata', res);
      },
      (err) => {
        console.log(err);
        this.isLoadingResults = false;
      },
    );
  }

  copyToClipboard(
    amount: string,
    description: string,
    encodedBy: string,
    dateEncoded: string,
  ) {
    this.clipboard.copy(
      `${amount.toUpperCase()} ${description.toUpperCase()} ${encodedBy.toUpperCase()} ${this.datePipe.transform(dateEncoded, 'MMM d, y, h:mm:ss a')}`,
    );
  }

  updateUnitAddImage(id: string, imgId: string): void {
    this.api.getGalleryById(imgId).subscribe((data: any) => {
      this.isLoadingResults = false;
      this.checkUnitCode(id, data);
    });
  }

  private calculateTotal() {
    var amounts = this.units.expenses.map((x) => {
      return Number(x.amount);
    });
    this.total = amounts.reduce((accum, curr) => accum + curr, 0);
  }

  private checkUnitCode(id: string, gallery: Gallery) {
    this.api.getUnitsById(id).subscribe((result: any) => {
      this.isLoadingResults = false;
      this.salesForm.setValue({
        unitCode: result.unitCode,
        makeAndModel: result.makeAndModel,
        bodyType: result.bodyType,
        chasisCode: result.chasisCode,
        expenses: result.expenses,
        imageFile: gallery,
      });

      this.api.updateUnits(id, this.salesForm.value).subscribe(
        (res: any) => {
          this.isLoadingResults = false;
          this.socket.emit('updatedata', res);
          this.router.navigate(['/sales-details', id]);
        },
        (err: any) => {
          console.log(err);
          this.isLoadingResults = false;
        },
      );
    });
  }
}
