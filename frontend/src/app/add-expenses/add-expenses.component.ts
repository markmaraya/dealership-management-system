import { Component, OnInit, Inject } from '@angular/core';
import { io } from "socket.io-client";
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { UntypedFormControl, FormGroupDirective, UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-expenses',
  templateUrl: './add-expenses.component.html',
  styleUrls: ['./add-expenses.component.css']
})
export class AddExpensesComponent implements OnInit {
  socket = io('http://localhost:4000');

  salesForm: UntypedFormGroup;
  _id = '';
  _unitCode = '';
  amount = '';
  description = '';
  encodedBy = '';
  dateEncoded: Date;
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private router: Router,
    private api: ApiService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AddExpensesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {
    this._id = this.data._id;
    this._unitCode = this.data.unitCode;
    this.salesForm = this.formBuilder.group({
      amount: [null, Validators.required],
      description: [null, Validators.required],
      encodedBy: [null, Validators.required]
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;    

    this.salesForm.setValue({
      amount : this.salesForm.value.amount,
      description : this.salesForm.value.description.toLowerCase(),
      encodedBy : this.salesForm.value.encodedBy.toLowerCase()
    });

    this.salesForm.value.unitCode = this._id;
    this.salesForm.value.dateEncoded = Date.now();
    
    this.api.addExpenses(this.salesForm.value)
      .subscribe((res: any) => {
        const id = res._id;
        this.isLoadingResults = false;
        this.socket.emit('updatedata', res);
        this.router.navigate(['/sales-details', this._id]);
      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }
}
