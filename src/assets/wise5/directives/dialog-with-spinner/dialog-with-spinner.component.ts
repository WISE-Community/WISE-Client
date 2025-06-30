import { Component } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  imports: [FlexLayoutModule, MatDialogModule, MatProgressSpinnerModule],
  styleUrl: './dialog-with-spinner.component.scss',
  templateUrl: './dialog-with-spinner.component.html'
})
export class DialogWithSpinnerComponent extends DialogComponent {}
