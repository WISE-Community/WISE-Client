import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from '../../services/projectService';
import { NodeIconComponent } from '../../vle/node-icon/node-icon.component';
import { NodeIconChooserDialog } from '../../common/node-icon-chooser-dialog/node-icon-chooser-dialog.component';
import { Component } from '@angular/core';

@Component({
  selector: 'teacher-node-icon',
  templateUrl: '../../vle/node-icon/node-icon.component.html',
  styleUrls: ['../../vle/node-icon/node-icon.component.scss']
})
export class TeacherNodeIconComponent extends NodeIconComponent {
  constructor(protected dialog: MatDialog, protected projectService: ProjectService) {
    super(dialog, projectService);
  }

  openNodeIconChooserDialog() {
    this.dialog.open(NodeIconChooserDialog, {
      data: { node: this.node },
      panelClass: 'dialog-md'
    });
  }
}
