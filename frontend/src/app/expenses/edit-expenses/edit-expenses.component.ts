import { environment } from '../../../environments/environment';
import { Component, OnInit, Inject } from '@angular/core';
import { io } from 'socket.io-client';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';
import {
  UntypedFormControl,
  FormGroupDirective,
  UntypedFormBuilder,
  UntypedFormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  selector: 'app-edit-expenses',
  templateUrl: './edit-expenses.component.html',
  styleUrls: ['./edit-expenses.component.scss'],
})
export class EditExpensesComponent implements OnInit {
  // socket = io(environment.apiUrl);
  socket = { on: () => {}, emit: () => {} } as any;

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
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.unitId = this.data.unitId;
    this.expensesId = this.data.expensesId;
    this.getExpensesById(this.expensesId);
    this.salesForm = this.formBuilder.group({
      amount: [null, Validators.required],
      description: [null, Validators.required],
      encodedBy: [null, Validators.required],
    });
  }

  getExpensesById(id: any) {
    this.api.getExpensesById(id).subscribe((data: any) => {
      if (data) {
        this.salesForm.setValue({
          amount: data.amount,
          description: data.description,
          encodedBy: data.encodedBy,
        });
      }
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    this.salesForm.setValue({
      amount: this.salesForm.value.amount,
      description: this.salesForm.value.description,
      encodedBy: this.salesForm.value.encodedBy,
    });
    this.api.updateExpenses(this.expensesId, this.salesForm.value).subscribe(
      (res: any) => {
        console.log(res);
        this.isLoadingResults = false;
        this.socket.emit('updatedata', res);
        this.dialogRef.close();
        this.snackBar.open('Expenses updated successfully', 'Close', {
          duration: 5000,
        });
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['/unit-details', this.unitId]);
          });
      },
      (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
        this.snackBar.open('Error updating expenses', 'Close', {
          duration: 3000,
        });
      },
    );
  }
}
