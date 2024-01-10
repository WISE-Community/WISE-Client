import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component as WISEComponent } from '../../../common/Component';

@Component({
  templateUrl: 'student-assets-dialog.component.html'
})
export class StudentAssetsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) protected component: WISEComponent) {}
}
