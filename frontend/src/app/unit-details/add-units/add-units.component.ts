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
import { MatSnackBar } from '@angular/material/snack-bar';
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
  // socket = io(environment.apiUrl);
  socket = { on: () => {}, emit: () => {} } as any;

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
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.salesForm = this.formBuilder.group({
      unitCode: [null, Validators.required],
      makeAndModel: [null, Validators.required],
      bodyType: [null, Validators.required],
      chasisCode: [null, Validators.required],
      status: null,
      expenses: null,
      imageFile: [null, [this.imageFileValidator]],
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    this.salesForm.setValue({
      unitCode: this.salesForm.value.unitCode,
      makeAndModel: this.salesForm.value.makeAndModel,
      bodyType: this.salesForm.value.bodyType,
      chasisCode: this.salesForm.value.chasisCode,
      status: 'available',
      expenses: this.expenses,
      imageFile: this.salesForm.value.imageFile ?? this.imageFile,
    });
    this.checkUnitCode(this.salesForm.value.unitCode);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    this.salesForm.patchValue({ imageFile: file ?? null });
  }

  private checkUnitCode(unitCode: string) {
    this.api.getUnitsByUnitCode(unitCode).subscribe((result: any) => {
      if (result.length == 0) {
        this.api.addUnits(this.salesForm.value).subscribe(
          (res: any) => {
            const id = res._id;

            if (
              this.salesForm.value.imageFile &&
              typeof this.salesForm.value.imageFile === 'object' &&
              'name' in this.salesForm.value.imageFile &&
              'size' in this.salesForm.value.imageFile &&
              'type' in this.salesForm.value.imageFile
            ) {
              this.saveImageFile(id);
            }

            this.isLoadingResults = false;
            this.socket.emit('updatedata', res);
            this.snackBar.open(`Unit ${unitCode} added successfully`, 'Close', {
              duration: 5000,
            });
            this.dialogRef.close();
            this.router.navigate(['/unit-details', id]);
          },
          (err: any) => {
            console.log(err);
            this.isLoadingResults = false;
            this.snackBar.open('Error adding unit', 'Close', {
              duration: 3000,
            });
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

  private imageFileValidator(control: AbstractControl) {
    const file: File = control.value;
    if (!file) return null;

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      return { invalidFileType: true };
    }
    return null;
  }

  private saveImageFile(unitId: string) {
    this.api
      .addGallery(
        this.salesForm.value.imageFile,
        this.salesForm.get('imageFile')?.value,
        unitId,
      )
      .subscribe(
        (res: any) => {
          this.isLoadingResults = false;
          if (res.body) {
            this.router.navigate(['/unit-details', unitId], {
              queryParams: { imgId: res.body._id },
            });
            this.dialogRef.close();
          }
        },
        (err: any) => {
          console.log(err);
          this.isLoadingResults = false;
        },
      );
  }
}
