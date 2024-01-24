import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShareRunDialogComponent } from '../share-run-dialog/share-run-dialog.component';
import { LibraryProjectDetailsComponent } from '../../modules/library/library-project-details/library-project-details.component';
import { UserService } from '../../services/user.service';
import { TeacherRun } from '../teacher-run';
import { ConfigService } from '../../services/config.service';
import { RunSettingsDialogComponent } from '../run-settings-dialog/run-settings-dialog.component';
import { EditRunWarningDialogComponent } from '../edit-run-warning-dialog/edit-run-warning-dialog.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArchiveProjectService } from '../../services/archive-project.service';
import { ArchiveProjectResponse } from '../../domain/archiveProjectResponse';

@Component({
  selector: 'app-run-menu',
  templateUrl: './run-menu.component.html',
  styleUrls: ['./run-menu.component.scss']
})
export class RunMenuComponent implements OnInit {
  private editLink: string = '';
  protected reportProblemLink: string = '';
  @Input() run: TeacherRun;
  @Output() runArchiveStatusChangedEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private archiveProjectService: ArchiveProjectService,
    private dialog: MatDialog,
    private userService: UserService,
    private configService: ConfigService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.editLink = `${this.configService.getContextPath()}/teacher/edit/unit/${
      this.run.project.id
    }`;
    this.reportProblemLink = `${this.configService.getContextPath()}/contact?runId=${this.run.id}`;
  }

  protected shareRun() {
    this.dialog.open(ShareRunDialogComponent, {
      data: { run: this.run },
      panelClass: 'dialog-md'
    });
  }

  protected showUnitDetails() {
    const project = this.run.project;
    this.dialog.open(LibraryProjectDetailsComponent, {
      data: { project: project, isRunProject: true },
      panelClass: 'dialog-md'
    });
  }

  protected canEdit() {
    return this.run.project.canEdit(this.userService.getUserId());
  }

  protected canShare() {
    return this.run.canGradeAndManage(this.userService.getUserId());
  }

  protected showEditRunDetails() {
    const run = this.run;
    this.dialog.open(RunSettingsDialogComponent, {
      ariaLabel: $localize`Run Settings`,
      data: { run: run },
      panelClass: 'dialog-md',
      autoFocus: true
    });
  }

  protected editContent() {
    if (this.run.lastRun) {
      this.dialog.open(EditRunWarningDialogComponent, {
        ariaLabel: $localize`Edit Classroom Unit Warning`,
        data: { run: this.run },
        panelClass: 'dialog-sm'
      });
    } else {
      this.router.navigateByUrl(this.editLink);
    }
  }

  protected archive(archive: boolean): void {
    this.archiveProjectService[archive ? 'archiveProject' : 'unarchiveProject'](
      this.run.project
    ).subscribe({
      next: (response: ArchiveProjectResponse) => {
        this.updateArchivedStatus(this.run, response.archived);
        this.showSuccessMessage(this.run, archive);
      },
      error: () => {
        this.showErrorMessage(archive);
      }
    });
  }

  private showSuccessMessage(run: TeacherRun, archive: boolean): void {
    this.openSnackBar(
      run,
      $localize`Successfully ${archive ? 'archived' : 'restored'} unit.`,
      archive ? 'unarchiveProject' : 'archiveProject'
    );
  }

  private showErrorMessage(archive: boolean): void {
    this.snackBar.open($localize`Error ${archive ? 'archiving' : 'unarchiving'} unit.`);
  }

  private updateArchivedStatus(run: TeacherRun, archived: boolean): void {
    run.project.archived = archived;
    this.runArchiveStatusChangedEvent.emit();
  }

  private openSnackBar(run: TeacherRun, message: string, undoFunctionName: string): void {
    this.snackBar
      .open(message, $localize`Undo`)
      .onAction()
      .subscribe(() => {
        this.undoArchiveAction(run, undoFunctionName);
      });
  }

  private undoArchiveAction(run: TeacherRun, archiveFunctionName: string): void {
    this.archiveProjectService[archiveFunctionName](run.project).subscribe({
      next: (response: ArchiveProjectResponse) => {
        run.project.archived = response.archived;
        this.archiveProjectService.refreshProjects();
        this.snackBar.open($localize`Action undone.`);
      },
      error: () => {
        this.snackBar.open($localize`Error undoing action.`);
      }
    });
  }
}
