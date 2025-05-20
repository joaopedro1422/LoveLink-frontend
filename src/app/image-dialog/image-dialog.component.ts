
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { CommonModule , NgFor, NgForOf, NgIf} from '@angular/common'; 
@Component({
  selector: 'app-image-dialog',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, NgForOf],
  templateUrl: './image-dialog.component.html',
  styleUrl: './image-dialog.component.css'
})
export class ImageDialogComponent implements OnInit {
  imageUrl: string = '';
  constructor(
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {  imagePath?: string}
  ) {}
  ngOnInit(): void {
    this.getImage();
  }
  getImage() {
    const storage = getStorage();
    if(this.data.imagePath){
      this.imageUrl = this.data.imagePath;
    }
  
  
  
}

  close(): void {
    this.dialogRef.close();
  }
}
