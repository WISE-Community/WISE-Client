import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

@Component({
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatListModule],
  selector: 'app-choose-branch-path-dialog',
  standalone: true,
  styleUrl: './choose-branch-path-dialog.component.scss',
  templateUrl: './choose-branch-path-dialog.component.html'
})
export class ChooseBranchPathDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) protected paths: any) {}
}
