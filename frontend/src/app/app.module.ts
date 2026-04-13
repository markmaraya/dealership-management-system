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

import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
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
