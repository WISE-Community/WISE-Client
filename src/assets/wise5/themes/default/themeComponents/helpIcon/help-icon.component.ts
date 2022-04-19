'use strict';

import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogWithCloseComponent } from '../../../../directives/dialog-with-close/dialog-with-close.component';
import { DialogData } from '../../../../../../app/domain/dialogData';

@Component({
  selector: 'help-icon',
  styleUrls: ['help-icon.component.scss'],
  templateUrl: 'help-icon.component.html'
})
export class HelpIconComponent {
  @Input()
  color: string;

  @Input()
  customClass: string;

  @Input()
  icon: string;

  @Input()
  iconClass: string;

  @Input()
  label: string;

  @Input()
  pulse: boolean;

  @Input()
  content: string;

  constructor(public dialog: MatDialog) {}

  showRubric() {
    this.dialog.open(DialogWithCloseComponent, {
      data: new DialogData($localize`Rubric`, this.content)
    });
  }
}
