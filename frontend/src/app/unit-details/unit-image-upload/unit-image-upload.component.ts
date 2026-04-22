import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
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
  selector: 'app-unit-image-upload',
  templateUrl: './unit-image-upload.component.html',
  styleUrls: ['./unit-image-upload.component.scss'],
})
export class UnitImageUploadComponent implements OnInit {
  _id: string;
  galleryForm: UntypedFormGroup;
  imageFile: File = null;
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();
  isUploadButtonActive: boolean = false;

  constructor(
    private api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<UnitImageUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.galleryForm = this.formBuilder.group({
      imageFile: [null, Validators.required],
    });

    this.galleryForm.controls['imageFile'].valueChanges.subscribe((data) => {
      this.isUploadButtonActive = data ? true : false;
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.galleryForm.patchValue({ imageFile: file });
      this.galleryForm.get('imageFile')?.updateValueAndValidity();
    } else {
      this.galleryForm.patchValue({ imageFile: null });
      this.galleryForm.get('imageFile')?.updateValueAndValidity();
    }
  }

  onUploadFormSubmit(): void {
    this.isLoadingResults = true;
    this.api
      .addGallery(
        this.galleryForm.value,
        this.galleryForm.get('imageFile')?.value,
        this.data._id,
      )
      .subscribe(
        (res: any) => {
          this.isLoadingResults = false;
          if (res.body) {
            this.router.navigate(['/unit-details', this.data._id], {
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
