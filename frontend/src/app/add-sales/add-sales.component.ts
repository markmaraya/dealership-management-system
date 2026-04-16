import { environment } from '../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { io } from "socket.io-client";
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { UntypedFormControl, FormGroupDirective, UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Expenses } from '../expenses';
import { Gallery } from '../gallery';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-sales',
  templateUrl: './add-sales.component.html',
  styleUrls: ['./add-sales.component.scss']
})
export class AddSalesComponent implements OnInit {
  socket = io(environment.apiUrl);

  salesForm: UntypedFormGroup;
  unitCode = '';
  makeAndModel = '';
  bodyType = '';
  chasisCode = '';
  expenses: Expenses = new Expenses;
  imageFile: Gallery = new Gallery;
  unitCodeExist: boolean = false;
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();

  constructor(private router: Router, private api: ApiService, private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.salesForm = this.formBuilder.group({
      unitCode: [null, Validators.required],
      makeAndModel: [null, Validators.required],
      bodyType: [null, Validators.required],
      chasisCode: [null, Validators.required],
      status: null,
      expenses: null,
      imageFile: null
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
      imageFile: this.imageFile
    });
    this.checkUnitCode(this.salesForm.value.unitCode);
  }  

  private checkUnitCode(unitCode: string) {
    this.api.getUnitsByUnitCode(unitCode).subscribe((result: any) => {
      if (result.length == 0) {
        this.api.addUnits(this.salesForm.value)
          .subscribe((res: any) => {
            const id = res._id;
            this.isLoadingResults = false;
            this.socket.emit('updatedata', res);
            this.router.navigate(['/sales-details', id]);
          }, (err: any) => {
            console.log(err);
            this.isLoadingResults = false;
          });
      } else {
        this.isLoadingResults = false;        
        this.salesForm = this.formBuilder.group({
          unitCode: ['', [
            Validators.required,
          ]],
          makeAndModel: [this.salesForm.value.makeAndModel, Validators.required],
          bodyType: [this.salesForm.value.bodyType, Validators.required],
          chasisCode: [this.salesForm.value.chasisCode, Validators.required],
          status: 'available',
          expenses: this.expenses,
          imageFile: this.imageFile
        });
        this.unitCodeExist = true;
      }
    });
  }

  onFocusUnitCode() {
    this.unitCodeExist = false;
  }

}
