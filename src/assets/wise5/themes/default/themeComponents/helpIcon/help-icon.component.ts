'use strict';

import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HtmlDialog } from '../../../../directives/html-dialog/html-dialog';

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
    this.dialog.open(HtmlDialog, {
      data: {
        content: this.content,
        isShowCloseButton: true,
        title: $localize`Rubric`
      }
    });
  }
}
