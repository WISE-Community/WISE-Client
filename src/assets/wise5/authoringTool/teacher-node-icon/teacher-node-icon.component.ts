import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NodeIconChooserDialogComponent } from '../../common/node-icon-chooser-dialog/node-icon-chooser-dialog.component';
import { NodeIconComponent } from '../../vle/node-icon/node-icon.component';

@Component({
  imports: [CommonModule, MatBadgeModule, MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'teacher-node-icon',
  styleUrl: '../../vle/node-icon/node-icon.component.scss',
  templateUrl: '../../vle/node-icon/node-icon.component.html'
})
export class TeacherNodeIconComponent extends NodeIconComponent {
  protected openNodeIconChooserDialog(): void {
    this.dialog.open(NodeIconChooserDialogComponent, {
      data: { node: this.node },
      panelClass: 'dialog-md'
    });
  }
}
