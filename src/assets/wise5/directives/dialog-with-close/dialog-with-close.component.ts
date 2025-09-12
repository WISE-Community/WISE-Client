import { Component } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './dialog-with-close.component.html'
})
export class DialogWithCloseComponent extends DialogComponent {}
