import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Project } from '../../../domain/project';
import { TeacherService } from '../../../teacher/teacher.service';
import { ShareProjectDialogComponent } from '../share-project-dialog/share-project-dialog.component';
import { UserService } from '../../../services/user.service';
import { ConfigService } from '../../../services/config.service';
import { EditRunWarningDialogComponent } from '../../../teacher/edit-run-warning-dialog/edit-run-warning-dialog.component';
import { ArchiveProjectService } from '../../../services/archive-project.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { CopyProjectDialogComponent } from '../copy-project-dialog/copy-project-dialog.component';

@Component({
  imports: [MatButtonModule, MatDividerModule, MatIconModule, MatMenuModule],
  selector: 'app-library-project-menu',
  styleUrl: './library-project-menu.component.scss',
  templateUrl: './library-project-menu.component.html'
})
export class LibraryProjectMenuComponent {
  protected archived: boolean;
  protected canEdit: boolean;
  protected canShare: boolean;
  protected isChild: boolean;
  @Input() isMyUnit: boolean;
  @Input() isRun: boolean;
  @Input() project: Project;
  protected publishUnitUrl: string;

  constructor(
    private archiveProjectService: ArchiveProjectService,
    private configService: ConfigService,
    private dialog: MatDialog,
    private teacherService: TeacherService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.canEdit = this.isOwner() || this.isSharedOwnerWithEditPermission();
    this.canShare = this.isOwner() && !this.isRun;
    this.isChild = this.project.isChild();
    this.archived = this.project.hasTagWithText('archived');
    this.publishUnitUrl = `${this.configService.getContextPath()}/contact?projectId=${this.project.id}&publish=true`;
  }

  private isOwner(): boolean {
    return this.userService.getUserId() == this.project.owner.id;
  }

  private isSharedOwnerWithEditPermission(): boolean {
    const userId = this.userService.getUserId();
    return this.project.sharedOwners.some(
      (owner) => owner.id === userId && this.hasEditPermission(owner)
    );
  }

  private hasEditPermission(sharedOwner: any): boolean {
    return sharedOwner.permissions.includes(Project.EDIT_PERMISSION);
  }

  protected copyProject(): void {
    this.dialog.open(CopyProjectDialogComponent, {
      data: this.project,
      panelClass: 'dialog-sm'
    });
  }

  protected editProject(): void {
    this.teacherService.getProjectLastRun(this.project.id).subscribe((projectRun) => {
      if (projectRun != null) {
        projectRun.project = this.project;
        this.dialog.open(EditRunWarningDialogComponent, {
          data: projectRun,
          panelClass: 'dialog-sm'
        });
      } else {
        window.location.href = `${this.configService.getContextPath()}/teacher/edit/unit/${this.project.id}`;
      }
    });
  }

  protected shareProject(): void {
    this.dialog.open(ShareProjectDialogComponent, {
      data: { project: this.project },
      panelClass: 'dialog-md'
    });
  }

  protected archive(archive: boolean): void {
    this.archiveProjectService.archiveProject(this.project, archive);
  }
}
