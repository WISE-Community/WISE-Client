import { Component, inject } from '@angular/core';
import {
  MatDialogModule,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { LibraryProject } from '../libraryProject';
import { LibraryService } from '../../../services/library.service';
import { Project } from '../../../domain/project';

@Component({
  imports: [MatButtonModule, MatDialogModule, MatProgressBarModule, MatSnackBarModule],
  templateUrl: './copy-project-dialog.component.html'
})
export class CopyProjectDialogComponent {
  dialog = inject(MatDialog);
  dialogRef = inject<MatDialogRef<CopyProjectDialogComponent>>(MatDialogRef);
  private libraryService = inject(LibraryService);
  project = inject<Project>(MAT_DIALOG_DATA);
  private snackBar = inject(MatSnackBar);

  protected isCopying: boolean = false;

  constructor() {
    this.libraryService.newProjectSource$.subscribe(() => {
      this.dialog.closeAll();
    });
  }

  protected copy(): void {
    this.isCopying = true;
    this.libraryService
      .copyProject(this.project.id)
      .pipe(
        finalize(() => {
          this.isCopying = false;
        })
      )
      .subscribe(
        (response: any) => {
          if (response.status === 'error') {
            this.showErrorMessage();
          } else {
            const newLibraryProject: LibraryProject = new LibraryProject(response);
            newLibraryProject.visible = true;
            this.libraryService.addPersonalLibraryProject(newLibraryProject);
          }
        },
        (error) => {
          this.showErrorMessage();
        }
      );
  }

  private showErrorMessage(): void {
    this.snackBar.open(
      $localize`There was an error trying to copy the project. Please refresh the page and try again.`
    );
  }
}
