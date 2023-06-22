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
import { TeacherService } from '../teacher.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-run-menu',
  templateUrl: './run-menu.component.html',
  styleUrls: ['./run-menu.component.scss']
})
export class RunMenuComponent implements OnInit {
  @Input() run: TeacherRun;
  @Output() runArchiveStatusChangedEvent: EventEmitter<any> = new EventEmitter<any>();

  editLink: string = '';
  isOwner: boolean;
  reportProblemLink: string = '';

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private configService: ConfigService,
    private router: Router,
    private snackBar: MatSnackBar,
    private teacherService: TeacherService
  ) {}

  ngOnInit() {
    this.editLink = `${this.configService.getContextPath()}/teacher/edit/unit/${
      this.run.project.id
    }`;
    this.isOwner = this.run.isOwner(this.userService.getUserId());
    this.reportProblemLink = `${this.configService.getContextPath()}/contact?runId=${this.run.id}`;
  }

  shareRun() {
    this.dialog.open(ShareRunDialogComponent, {
      data: { run: this.run },
      panelClass: 'dialog-md'
    });
  }

  showUnitDetails() {
    const project = this.run.project;
    this.dialog.open(LibraryProjectDetailsComponent, {
      data: { project: project, isRunProject: true },
      panelClass: 'dialog-md'
    });
  }

  canEdit() {
    return this.run.project.canEdit(this.userService.getUserId());
  }

  canShare() {
    return this.run.canGradeAndManage(this.userService.getUserId());
  }

  isRunCompleted() {
    return this.run.isCompleted(this.configService.getCurrentServerTime());
  }

  showEditRunDetails() {
    const run = this.run;
    this.dialog.open(RunSettingsDialogComponent, {
      ariaLabel: $localize`Run Settings`,
      data: { run: run },
      panelClass: 'dialog-md',
      autoFocus: true
    });
  }

  editContent() {
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

  archive(): void {
    const run = this.run;
    this.teacherService.archiveRun(run).subscribe({
      next: () => {
        run.isArchived = true;
        this.runArchiveStatusChangedEvent.emit(run);
        this.snackBar.open($localize`Successfully Archived Run`);
      },
      error: () => {
        this.snackBar.open($localize`Error Archiving Run`);
      }
    });
  }

  unarchive(): void {
    const run = this.run;
    this.teacherService.unarchiveRun(run).subscribe({
      next: () => {
        run.isArchived = false;
        this.runArchiveStatusChangedEvent.emit(run);
        this.snackBar.open($localize`Successfully Unarchived Run`);
      },
      error: () => {
        this.snackBar.open($localize`Error Unarchiving Run`);
      }
    });
  }
}
