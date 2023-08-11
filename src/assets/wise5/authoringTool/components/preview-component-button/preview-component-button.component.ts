import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PreviewComponentDialogComponent } from '../preview-component-dialog/preview-component-dialog.component';
import { ProjectService } from '../../../services/projectService';
import { ComponentFactory } from '../../../common/ComponentFactory';

@Component({
  selector: 'preview-component-button',
  templateUrl: 'preview-component-button.component.html'
})
export class PreviewComponentButtonComponent implements OnInit {
  @Input() componentId: string;
  @Input() nodeId: string;

  constructor(private dialog: MatDialog, private projectService: ProjectService) {}

  ngOnInit(): void {}

  protected popUpComponentPreview(event: any): void {
    event.stopPropagation();
    const content = this.projectService.injectAssetPaths(
      this.projectService.getComponent(this.nodeId, this.componentId)
    );
    this.dialog.open(PreviewComponentDialogComponent, {
      data: new ComponentFactory().getComponent(content, this.nodeId),
      panelClass: 'dialog-lg'
    });
  }
}
