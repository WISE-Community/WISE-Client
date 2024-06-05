import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PreviewComponentDialogComponent } from '../preview-component-dialog/preview-component-dialog.component';
import { ProjectService } from '../../../services/projectService';
import { ComponentFactory } from '../../../common/ComponentFactory';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'preview-component-button',
  standalone: true,
  templateUrl: 'preview-component-button.component.html'
})
export class PreviewComponentButtonComponent {
  @Input() componentId: string;
  @Input() nodeId: string;

  constructor(private dialog: MatDialog, private projectService: ProjectService) {}

  protected popUpComponentPreview(): void {
    const content = this.projectService.injectAssetPaths(
      this.projectService.getComponent(this.nodeId, this.componentId)
    );
    this.dialog.open(PreviewComponentDialogComponent, {
      data: new ComponentFactory().getComponent(content, this.nodeId),
      panelClass: 'dialog-lg'
    });
  }
}
