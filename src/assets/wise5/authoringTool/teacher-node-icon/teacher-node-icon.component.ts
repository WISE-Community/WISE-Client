import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from '../../services/projectService';
import { NodeIconComponent } from '../../vle/node-icon/node-icon.component';
import { NodeIconChooserDialogComponent } from '../../common/node-icon-chooser-dialog/node-icon-chooser-dialog.component';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    NodeIconChooserDialogComponent
  ],
  selector: 'teacher-node-icon',
  standalone: true,
  styleUrl: '../../vle/node-icon/node-icon.component.scss',
  templateUrl: '../../vle/node-icon/node-icon.component.html'
})
export class TeacherNodeIconComponent extends NodeIconComponent {
  constructor(
    protected dialog: MatDialog,
    protected projectService: ProjectService
  ) {
    super(dialog, projectService);
  }

  protected openNodeIconChooserDialog(): void {
    this.dialog.open(NodeIconChooserDialogComponent, {
      data: { node: this.node },
      panelClass: 'dialog-md'
    });
  }
}
