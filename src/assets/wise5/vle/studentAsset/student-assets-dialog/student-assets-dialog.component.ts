import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Component as WISEComponent } from '../../../common/Component';
import { StudentAssetsComponent } from '../student-assets/student-assets.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, MatButtonModule, MatDialogModule, StudentAssetsComponent],
  templateUrl: 'student-assets-dialog.component.html'
})
export class StudentAssetsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) protected component: WISEComponent) {}
}
