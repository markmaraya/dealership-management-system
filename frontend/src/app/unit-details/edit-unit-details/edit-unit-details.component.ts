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
  AbstractControl,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    public snackBar: MatSnackBar,
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
      imageFile: [null, [this.imageFileValidator]],
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
        imageFile: null,
      });
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    const payload: any = {
      unitCode: this.salesForm.value.unitCode,
      makeAndModel: this.salesForm.value.makeAndModel,
      bodyType: this.salesForm.value.bodyType,
      chasisCode: this.salesForm.value.chasisCode,
      status: this.salesForm.value.status,
      expenses: this.salesForm.value.expenses,
      imageFile: this.salesForm.value.imageFile ?? null,
    };

    if (payload.imageFile === null) {
      delete payload.imageFile;
    }

    this.checkUnitCode(payload);
  }

  private checkUnitCode(payload: any) {
    this.api.getUnitsByUnitCode(payload.unitCode).subscribe((result: any) => {
      // *Unit Code can be edited currently
      // if (result.length == 0) {
      this.api.updateUnits(this._id, payload).subscribe(
        (res: any) => {
          const id = res._id;

          if (
            payload.imageFile &&
            typeof payload.imageFile === 'object' &&
            'name' in payload.imageFile &&
            'size' in payload.imageFile &&
            'type' in payload.imageFile
          ) {
            this.saveImageFile(id);
          }

          this.isLoadingResults = false;
          this.socket.emit('updatedata', res);
          this.snackBar.open('Unit details updated successfully', 'Close', {
            duration: 5000,
          });
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
          this.snackBar.open('Error updating unit details', 'Close', {
            duration: 3000,
          });
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.salesForm.patchValue({ imageFile: file ?? null });
    this.salesForm.get('imageFile')?.markAsDirty();
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
