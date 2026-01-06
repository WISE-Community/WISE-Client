import { Component, inject } from '@angular/core';
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
  dialog = inject(MatDialog);
  dialogRef = inject<MatDialogRef<EditRunWarningDialogComponent>>(MatDialogRef);
  protected run = inject<Run>(MAT_DIALOG_DATA);
  private router = inject(Router);

  constructor() {
    this.dialog.closeAll();
  }

  protected editContent(): void {
    this.router.navigateByUrl(`/teacher/edit/unit/${this.run.project.id}`);
    this.dialogRef.close();
  }
}
