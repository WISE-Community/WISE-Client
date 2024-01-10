import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProjectAssetAuthoringComponent } from './project-asset-authoring.component';

export class AssetChooser {
  constructor(
    private dialog: MatDialog,
    private nodeId: string = null,
    private componentId: string = null,
    private projectId: number = null
  ) {}

  open(target: string, targetObject: any = null): MatDialogRef<ProjectAssetAuthoringComponent> {
    return this.dialog.open(ProjectAssetAuthoringComponent, {
      data: {
        componentId: this.componentId,
        isPopup: true,
        nodeId: this.nodeId,
        projectId: this.projectId,
        target: target,
        targetObject: targetObject
      },
      width: '80%'
    });
  }
}
