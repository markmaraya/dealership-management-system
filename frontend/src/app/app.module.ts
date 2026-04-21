import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgxPrintModule } from 'ngx-print';

import { AvailableUnitsComponent } from './units/available-units/available-units.component';
import { SoldUnitsComponent } from './units/sold-units/sold-units.component';
import { UnitDetailsComponent } from './units/unit-details/unit-details.component';
import { AddUnitsComponent } from './units/add-units/add-units.component';
import { EditUnitDetailsComponent } from './units/edit-unit-details/edit-unit-details.component';
import { UnitImageUploadComponent } from './units/unit-image-upload/unit-image-upload.component';

import { AddExpensesComponent } from './add-expenses/add-expenses.component';
import { EditExpensesComponent } from './edit-expenses/edit-expenses.component';

import { ConfirmationDialogComponent } from './dialog/confirmation-dialog/confirmation-dialog.component';
import { ImagePreviewDialogComponent } from './dialog/image-preview-dialog/image-preview-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AvailableUnitsComponent,
    SoldUnitsComponent,
    UnitDetailsComponent,
    AddUnitsComponent,
    EditUnitDetailsComponent,
    AddExpensesComponent,
    EditExpensesComponent,
    ConfirmationDialogComponent,
    UnitImageUploadComponent,
    ImagePreviewDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSelectModule,
    MatTooltipModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    BrowserAnimationsModule,
    ClipboardModule,
    NgxPrintModule,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
