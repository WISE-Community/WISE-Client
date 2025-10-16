import { Component } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  imports: [MatDialogTitle, CdkScrollable, MatDialogContent],
  templateUrl: './dialog-without-close.component.html'
})
export class DialogWithoutCloseComponent extends DialogComponent {}
