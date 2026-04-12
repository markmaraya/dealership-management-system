import { Component, OnInit, Inject } from '@angular/core';
import { io } from "socket.io-client";
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { UntypedFormControl, FormGroupDirective, UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from "@angular/material/legacy-dialog";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-edit-expenses',
  templateUrl: './edit-expenses.component.html',
  styleUrls: ['./edit-expenses.component.css']
})
export class EditExpensesComponent implements OnInit {
  socket = io('http://localhost:4000');

  salesForm: UntypedFormGroup;
  unitId: '';
  expensesId: '';
  _id = '';
  amount = '';
  description = '';
  encodedBy = '';
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private router: Router,
    private api: ApiService,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditExpensesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.unitId = this.data.unitId;
    this.expensesId = this.data.expensesId;
    this.getExpensesById(this.expensesId);
    this.salesForm = this.formBuilder.group({
      amount: [null, Validators.required],
      description: [null, Validators.required],
      encodedBy: [null, Validators.required]
    });
  }

  getExpensesById(id: any) {
    this.api.getExpensesById(id).subscribe((data: any) => {
      this.salesForm.setValue({
        amount: data.amount,
        description: data.description,
        encodedBy: data.encodedBy
      });
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    this.salesForm.setValue({
      amount: this.salesForm.value.amount,
      description: this.salesForm.value.description.toLowerCase(),
      encodedBy: this.salesForm.value.encodedBy.toLowerCase()
    });
    this.api.updateExpenses(this.expensesId, this.salesForm.value)
      .subscribe((res: any) => {
        console.log(res);
        this.isLoadingResults = false;
        this.socket.emit('updatedata', res);
        this.router.navigate(['/sales-details', this.unitId]);
      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      }
      );
  }

}
