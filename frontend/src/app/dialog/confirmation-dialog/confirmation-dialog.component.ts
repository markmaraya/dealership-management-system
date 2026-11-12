import { Component, OnInit, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss'],
    imports: [MatDialogModule, MatButtonModule]
})
export class ConfirmationDialogComponent implements OnInit {
  title!: string;
  message!: string;
  public data = inject<any>(MAT_DIALOG_DATA);

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
  ) {}

  ngOnInit() {
    this.title = this.data.title;
    this.message = this.data.message;
  }
}
