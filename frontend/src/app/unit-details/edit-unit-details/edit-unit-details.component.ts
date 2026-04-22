import { environment } from '../../../environments/environment';
import { Component, OnInit, Inject } from '@angular/core';
import { io } from 'socket.io-client';
import { Router, ActivatedRoute } from '@angular/router';
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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  selector: 'app-edit-unit-details',
  templateUrl: './edit-unit-details.component.html',
  styleUrls: ['./edit-unit-details.component.scss'],
})
export class EditUnitDetailsComponent implements OnInit {
  socket = io(environment.apiUrl);

  salesForm: UntypedFormGroup;
  _id = '';
  unitCode = '';
  makeAndModel = '';
  bodyType = '';
  chasisCode = '';
  status = '';
  expenses = null;
  unitCodeExist;
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<EditUnitDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this._id = this.data._id;
    this.getUnitsById(this._id);
    this.salesForm = this.formBuilder.group({
      unitCode: [null, Validators.required],
      makeAndModel: [null, Validators.required],
      bodyType: [null, Validators.required],
      chasisCode: [null, Validators.required],
      status: [null, Validators.required],
      expenses: null,
    });
  }

  getUnitsById(id: any) {
    this.api.getUnitsById(id).subscribe((data: any) => {
      this._id = data._id;
      this.salesForm.setValue({
        unitCode: data.unitCode,
        makeAndModel: data.makeAndModel,
        bodyType: data.bodyType,
        chasisCode: data.chasisCode,
        status: data.status || null,
        expenses: null,
      });
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    this.salesForm.setValue({
      unitCode: this.salesForm.value.unitCode.toLowerCase(),
      makeAndModel: this.salesForm.value.makeAndModel.toLowerCase(),
      bodyType: this.salesForm.value.bodyType.toLowerCase(),
      chasisCode: this.salesForm.value.chasisCode.toLowerCase(),
      status: this.salesForm.value.status.toLowerCase(),
      expenses: this.salesForm.value.expenses,
    });
    this.checkUnitCode(this.salesForm.value.unitCode);
  }

  private checkUnitCode(unitCode: string) {
    this.api.getUnitsByUnitCode(unitCode).subscribe((result: any) => {
      // *Unit Code can be edited currently
      // if (result.length == 0) {
      this.api.updateUnits(this._id, this.salesForm.value).subscribe(
        (res: any) => {
          this.isLoadingResults = false;
          this.socket.emit('updatedata', res);
          this.dialogRef.close();
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['/unit-details', this._id]);
            });
        },
        (err: any) => {
          console.log(err);
          this.isLoadingResults = false;
        },
      );
      // } else {
      //   this.isLoadingResults = false;
      //   this.salesForm = this.formBuilder.group({
      //     unitCode: ['', [
      //       Validators.required,
      //     ]],
      //     makeAndModel: [this.salesForm.value.makeAndModel, Validators.required],
      //     bodyType: [this.salesForm.value.bodyType, Validators.required],
      //     chasisCode: [this.salesForm.value.chasisCode, Validators.required],
      //     status: [this.salesForm.value.status, Validators.required],
      //     expenses: null
      //   });
      //   this.unitCodeExist = true;
      // }
    });
  }

  onFocusUnitCode() {
    this.unitCodeExist = false;
  }
}
