import { Component } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  imports: [MatDialogModule, MatProgressSpinnerModule],
  template: `
    <h2 mat-dialog-title [innerHTML]="dialogData.title"></h2>
    <div class="flex justify-center items-center">
      <mat-spinner [diameter]="50" />
    </div>
  `
})
export class DialogWithSpinnerComponent extends DialogComponent {}
