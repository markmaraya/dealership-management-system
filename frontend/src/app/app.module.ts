import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SalesComponent } from './sales/sales.component';
import { SalesDetailsComponent } from './sales-details/sales-details.component';
import { AddSalesComponent } from './add-sales/add-sales.component';
import { EditSalesComponent } from './edit-sales/edit-sales.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgxPrintModule } from 'ngx-print';

import { AddExpensesComponent } from './add-expenses/add-expenses.component';
import { EditExpensesComponent } from './edit-expenses/edit-expenses.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

import { DatePipe } from '@angular/common';
import { SalesImageUploadComponent } from './sales-image-upload/sales-image-upload.component';
import { ImagePreviewDialogComponent } from './image-preview-dialog/image-preview-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SalesComponent,
    SalesDetailsComponent,
    AddSalesComponent,
    EditSalesComponent,
    AddExpensesComponent,
    EditExpensesComponent,
    ConfirmationDialogComponent,
    SalesImageUploadComponent,
    ImagePreviewDialogComponent
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
    BrowserAnimationsModule,
    ClipboardModule,
    NgxPrintModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
