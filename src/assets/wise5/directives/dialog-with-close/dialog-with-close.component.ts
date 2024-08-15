import { Component } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  standalone: true,
  templateUrl: './dialog-with-close.component.html'
})
export class DialogWithCloseComponent extends DialogComponent {}
