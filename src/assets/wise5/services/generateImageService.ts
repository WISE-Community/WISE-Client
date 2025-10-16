import { Injectable } from '@angular/core';
import { StudentDataService } from './studentDataService';
import { MatDialog } from '@angular/material/dialog';
import { GenerateImageDialogComponent } from '../directives/generate-image-dialog/generate-image-dialog.component';

@Injectable({ providedIn: 'root' })
export class GenerateImageService {
  constructor(
    private dataService: StudentDataService,
    private dialog: MatDialog
  ) {
    this.dataService.generateImageRequest$.subscribe((componentState) => {
      this.generateImageFromComponentState(componentState).then((image) => {
        this.dataService.generateImageResponse(image);
      });
    });
  }

  generateImageFromComponentState(componentState: any): any {
    const dialogRef = this.dialog.open(GenerateImageDialogComponent, {
      data: componentState
    });
    return new Promise((resolve, reject) => {
      dialogRef.afterClosed().subscribe((result) => {
        resolve(result);
      });
    });
  }
}
