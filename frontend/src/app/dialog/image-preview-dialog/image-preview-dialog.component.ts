import { environment } from '../../../environments/environment';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../../api.service';
import { Gallery } from '../../models/gallery';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-image-preview-dialog',
    templateUrl: './image-preview-dialog.component.html',
    styleUrls: ['./image-preview-dialog.component.scss'],
    imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule
]
})
export class ImagePreviewDialogComponent implements OnInit {
  _id!: string;
  gallery: Gallery = { id: '', imageUrl: '', uploaded: null, unitCode: '' };
  environmentApiUrl = environment.apiUrl;
  public data = inject<any>(MAT_DIALOG_DATA);

  constructor(
    public dialogRef: MatDialogRef<ImagePreviewDialogComponent>,
    private api: ApiService,
  ) {}

  ngOnInit(): void {
    this.getImageById(this.data._id);
  }

  getImageById(id: string): void {
    this.api.getGalleryById(id).subscribe((data: any) => {
      this.gallery = data;
    });
  }
}
