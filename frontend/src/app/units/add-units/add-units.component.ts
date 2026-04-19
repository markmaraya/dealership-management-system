import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';
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
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Expenses } from '../../models/expenses';
import { Gallery } from '../../models/gallery';

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
  selector: 'app-add-units',
  templateUrl: './add-units.component.html',
  styleUrls: ['./add-units.component.scss'],
})
export class AddUnitsComponent implements OnInit {
  socket = io(environment.apiUrl);

  salesForm: UntypedFormGroup;
  unitCode = '';
  makeAndModel = '';
  bodyType = '';
  chasisCode = '';
  expenses: Expenses = new Expenses();
  imageFile: Gallery = new Gallery();
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private router: Router,
    private api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<AddUnitsComponent>,
  ) {}

  ngOnInit(): void {
    this.salesForm = this.formBuilder.group({
      unitCode: [null, Validators.required],
      makeAndModel: [null, Validators.required],
      bodyType: [null, Validators.required],
      chasisCode: [null, Validators.required],
      status: null,
      expenses: null,
      imageFile: null,
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    this.salesForm.setValue({
      unitCode: this.salesForm.value.unitCode.toLowerCase(),
      makeAndModel: this.salesForm.value.makeAndModel.toLowerCase(),
      bodyType: this.salesForm.value.bodyType.toLowerCase(),
      chasisCode: this.salesForm.value.chasisCode.toLowerCase(),
      status: 'available',
      expenses: this.expenses,
      imageFile: this.imageFile,
    });
    this.checkUnitCode(this.salesForm.value.unitCode);
  }

  private checkUnitCode(unitCode: string) {
    this.api.getUnitsByUnitCode(unitCode).subscribe((result: any) => {
      if (result.length == 0) {
        this.api.addUnits(this.salesForm.value).subscribe(
          (res: any) => {
            const id = res._id;
            this.isLoadingResults = false;
            this.socket.emit('updatedata', res);
            this.dialogRef.close();
            this.router.navigate(['/sales-details', id]);
          },
          (err: any) => {
            console.log(err);
            this.isLoadingResults = false;
          },
        );
      } else {
        this.isLoadingResults = false;
        this.salesForm = this.formBuilder.group({
          unitCode: [
            this.salesForm?.get('unitCode')?.value || '',
            [
              Validators.required,
              this.unitCodeExistsValidator(result[0]?.unitCode),
            ],
          ],
          makeAndModel: [
            this.salesForm?.get('makeAndModel')?.value || '',
            Validators.required,
          ],
          bodyType: [
            this.salesForm?.get('bodyType')?.value || '',
            Validators.required,
          ],
          chasisCode: [
            this.salesForm?.get('chasisCode')?.value || '',
            Validators.required,
          ],
          status: ['available'],
          expenses: [this.expenses],
          imageFile: [this.imageFile],
        });
      }
    });
  }

  private unitCodeExistsValidator(existingCodes: string[]) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim();
      if (!value) {
        return null;
      }
      return existingCodes.includes(value) ? { unitCodeExists: true } : null;
    };
  }
}
