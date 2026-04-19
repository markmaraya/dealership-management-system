import { environment } from '../../../environments/environment';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../api.service';
import { Gallery } from '../../models/gallery';

@Component({
  selector: 'app-image-preview-dialog',
  templateUrl: './image-preview-dialog.component.html',
  styleUrls: ['./image-preview-dialog.component.scss']
})
export class ImagePreviewDialogComponent implements OnInit {
  _id!: string;
  gallery: Gallery = { id: '', imageUrl: '', uploaded: null, unitCode: '' };
  environmentApiUrl = environment.apiUrl;

  constructor(
    public dialogRef: MatDialogRef<ImagePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.getImageById(this.data._id);
  }

  getImageById(id: string): void {
    this.api.getGalleryById(id).subscribe((data: any) => {
      this.gallery = data;
    });
  }

}
