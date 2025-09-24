import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { CreateRunDialogComponent } from '../../../teacher/create-run-dialog/create-run-dialog.component';
import { Project } from '../../../domain/project';
import { ParentProject } from '../../../domain/parentProject';
import { ConfigService } from '../../../services/config.service';
import { LibraryProjectMenuComponent } from '../library-project-menu/library-project-menu.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UnitTagsComponent } from '../../../teacher/unit-tags/unit-tags.component';
import { DiscourseCategoryActivityComponent } from '../discourse-category-activity/discourse-category-activity.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [
    CommonModule,
    DiscourseCategoryActivityComponent,
    LibraryProjectMenuComponent,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    UnitTagsComponent
  ],
  selector: 'app-library-project-details',
  styleUrl: './library-project-details.component.scss',
  templateUrl: './library-project-details.component.html'
})
export class LibraryProjectDetailsComponent implements OnInit {
  protected authorsString: string = '';
  protected canPreview: boolean;
  protected isCopy: boolean;
  protected isMyUnit: boolean;
  protected isTeacher: boolean;
  protected isRunProject: false;
  protected licenseInfo = $localize`License pertains to original content created by the author(s). Authors are responsible for the usage and attribution of any third-party content linked to or included in this work.`;
  protected licenseUrl = 'http://creativecommons.org/licenses/by-sa/4.0/';
  protected parentAuthorsString: string = '';
  protected parentProject: ParentProject;
  protected project: Project;
  protected standardLabels: any = {
    commonCore: $localize`Common Core`,
    learningForJustice: $localize`Learning For Justice`,
    ngss: $localize`NGSS`
  };
  protected standards: any;

  constructor(
    private configService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<LibraryProjectDetailsComponent>,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isTeacher = this.userService.isTeacher();
    this.isRunProject = this.data.isRunProject;
    if (this.data.project) {
      this.project = new Project(this.data.project);
      const numParents = this.data.project.metadata.parentProjects?.length ?? 0;
      if (numParents > 0) {
        this.parentProject = new ParentProject(
          this.data.project.metadata.parentProjects[numParents - 1]
        );
      }
      this.standards = this.project.metadata.standards;
      this.setLicenseInfo();
      this.canPreview = !(
        this.project.metadata.unitType === 'Other' && this.project.metadata.resources.length === 0
      );
    }
    this.isMyUnit = this.userIsAuthor();
  }

  private userIsAuthor(): boolean {
    return this.project.metadata.authors.some(
      (author) => author.id === this.userService.getUserId()
    );
  }

  private setLicenseInfo(): void {
    this.authorsString = this.getAuthorsString(this.project.metadata.authors);
    if (this.parentProject) {
      this.parentAuthorsString = this.getAuthorsString(this.parentProject.authors);
      if (!this.authorsString) {
        this.isCopy = true;
      }
    }
  }

  private getAuthorsString(authors: any[]): string {
    return authors?.map((author) => `${author.firstName} ${author.lastName}`).join(', ') ?? '';
  }

  protected close(): void {
    this.dialogRef.close();
  }

  protected runProject(): void {
    this.dialog.open(CreateRunDialogComponent, {
      data: this.data,
      panelClass: 'dialog-md',
      disableClose: true
    });
    this.dialogRef.close();
  }

  protected previewProject(): void {
    if (this.project.wiseVersion === 4) {
      window.open(
        `${this.configService.getWISE4Hostname()}` +
          `/previewproject.html?projectId=${this.project.id}`
      );
    } else {
      this.previewProjectV5();
    }
  }

  private previewProjectV5(): void {
    if (this.project.metadata.unitType === 'Platform') {
      window.open(`/preview/unit/${this.project.id}`);
    } else {
      window.open(this.project.metadata.resources[0].url);
    }
  }
}
