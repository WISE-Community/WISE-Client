import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: 'student-assets-dialog.component.html'
})
export class StudentAssetsDialogComponent {
  componentId: string;
  nodeId: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.componentId = data.componentId;
    this.nodeId = data.nodeId;
  }
}
