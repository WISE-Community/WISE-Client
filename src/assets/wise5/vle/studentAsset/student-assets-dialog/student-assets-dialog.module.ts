import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentAssetsModule } from '../student-assets/student-assets-module';
import { StudentAssetsDialogComponent } from './student-assets-dialog.component';

@NgModule({
  declarations: [StudentAssetsDialogComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule, StudentAssetsModule],
  exports: [StudentAssetsDialogComponent]
})
export class StudentAssetsDialogModule {}
