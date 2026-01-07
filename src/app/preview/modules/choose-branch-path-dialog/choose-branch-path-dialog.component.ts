import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

@Component({
  imports: [MatButtonModule, MatDialogModule, MatListModule],
  selector: 'app-choose-branch-path-dialog',
  styleUrl: './choose-branch-path-dialog.component.scss',
  templateUrl: './choose-branch-path-dialog.component.html'
})
export class ChooseBranchPathDialogComponent {
  protected paths = inject(MAT_DIALOG_DATA);
}
