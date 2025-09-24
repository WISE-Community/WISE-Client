import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentAssetsDialogComponent } from './student-assets-dialog.component';
import { StudentAssetsComponent } from '../student-assets/student-assets.component';

@NgModule({
  declarations: [StudentAssetsDialogComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule, StudentAssetsComponent],
  exports: [StudentAssetsDialogComponent]
})
export class StudentAssetsDialogModule {}
