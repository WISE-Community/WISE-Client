import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'component-info-dialog',
  templateUrl: './component-info-dialog.component.html',
  styleUrls: ['./component-info-dialog.component.scss']
})
export class ComponentInfoDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) protected data: any) {}
}
