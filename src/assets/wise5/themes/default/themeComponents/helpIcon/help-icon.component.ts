'use strict';

import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogWithCloseComponent } from '../../../../directives/dialog-with-close/dialog-with-close.component';

@Component({
  selector: 'help-icon',
  styleUrls: ['help-icon.component.scss'],
  templateUrl: 'help-icon.component.html'
})
export class HelpIconComponent {
  @Input() content: string;
  @Input() icon: string;
  @Input() iconClass: string;
  @Input() label: string;
  pulse: boolean = true;

  constructor(public dialog: MatDialog) {}

  showRubric() {
    this.dialog.open(DialogWithCloseComponent, {
      data: {
        content: this.content,
        title: $localize`Rubric`,
        scroll: true
      },
      panelClass: 'dialog-lg'
    });
    this.pulse = false;
  }
}
