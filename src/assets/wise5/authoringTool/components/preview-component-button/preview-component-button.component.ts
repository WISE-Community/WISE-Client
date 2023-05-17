import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PreviewComponentDialogComponent } from '../preview-component-dialog/preview-component-dialog.component';

@Component({
  selector: 'preview-component-button',
  templateUrl: 'preview-component-button.component.html'
})
export class PreviewComponentButtonComponent implements OnInit {
  @Input()
  componentId: string;

  @Input()
  nodeId: string;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  popUpComponentPreview(event: any): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(PreviewComponentDialogComponent, {
      panelClass: 'dialog-lg'
    });
    dialogRef.componentInstance.nodeId = this.nodeId;
    dialogRef.componentInstance.componentId = this.componentId;
  }
}
