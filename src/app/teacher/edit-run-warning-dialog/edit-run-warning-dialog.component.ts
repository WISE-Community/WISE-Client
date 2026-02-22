import { Component, Inject } from '@angular/core';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Run } from '../../domain/run';
import { Router } from '@angular/router';

@Component({
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './edit-run-warning-dialog.component.html'
})
export class EditRunWarningDialogComponent {
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditRunWarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) protected run: Run,
    private router: Router
  ) {
    this.dialog.closeAll();
  }

  protected editContent(): void {
    this.router.navigateByUrl(`/teacher/edit/unit/${this.run.project.id}`);
    this.dialogRef.close();
  }
}
