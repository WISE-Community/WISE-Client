import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { ShareRunDialogComponent } from '../share-run-dialog/share-run-dialog.component';
import { LibraryProjectDetailsComponent } from '../../modules/library/library-project-details/library-project-details.component';
import { UserService } from '../../services/user.service';
import { TeacherRun } from '../teacher-run';
import { RunSettingsDialogComponent } from '../run-settings-dialog/run-settings-dialog.component';
import { EditRunWarningDialogComponent } from '../edit-run-warning-dialog/edit-run-warning-dialog.component';
import { Router } from '@angular/router';
import { ArchiveProjectService } from '../../services/archive-project.service';

@Component({
  imports: [MatMenuModule, MatIconModule, MatButtonModule, MatDividerModule],
  selector: 'app-run-menu',
  styleUrl: './run-menu.component.scss',
  templateUrl: './run-menu.component.html'
})
export class RunMenuComponent implements OnInit {
  protected reportProblemLink: string = '';
  @Input() run: TeacherRun;
  @Output() runArchiveStatusChangedEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private archiveProjectService: ArchiveProjectService,
    private dialog: MatDialog,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reportProblemLink = `/contact?runId=${this.run.id}`;
  }

  protected shareRun(): void {
    this.dialog.open(ShareRunDialogComponent, {
      data: { run: this.run },
      panelClass: 'dialog-md'
    });
  }

  protected showUnitDetails(): void {
    this.dialog.open(LibraryProjectDetailsComponent, {
      data: { project: this.run.project, isRunProject: true },
      panelClass: 'dialog-md'
    });
  }

  protected canEdit(): boolean {
    return this.run.project.canEdit(this.userService.getUserId());
  }

  protected canShare(): boolean {
    return this.run.canGradeAndManage(this.userService.getUserId());
  }

  protected showEditRunDetails(): void {
    this.dialog.open(RunSettingsDialogComponent, {
      ariaLabel: $localize`Run Settings`,
      data: this.run,
      panelClass: 'dialog-md',
      autoFocus: true
    });
  }

  protected editContent(): void {
    if (this.run.lastRun) {
      this.dialog.open(EditRunWarningDialogComponent, {
        ariaLabel: $localize`Edit Classroom Unit Warning`,
        data: this.run,
        panelClass: 'dialog-sm'
      });
    } else {
      this.router.navigateByUrl(`/teacher/edit/unit/${this.run.project.id}`);
    }
  }

  protected archive(archive: boolean): void {
    this.archiveProjectService.archiveProject(this.run.project, archive);
  }
}
