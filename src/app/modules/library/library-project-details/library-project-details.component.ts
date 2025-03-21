import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { CreateRunDialogComponent } from '../../../teacher/create-run-dialog/create-run-dialog.component';
import { NGSSStandards } from '../ngssStandards';
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
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  imports: [
    CommonModule,
    DiscourseCategoryActivityComponent,
    FlexLayoutModule,
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
  protected isCopy: boolean;
  protected isTeacher: boolean;
  protected isRunProject: false;
  protected licenseInfo = $localize`License pertains to original content created by the author(s). Authors are responsible for the usage and attribution of any third-party content linked to or included in this work.`;
  protected licenseUrl = 'http://creativecommons.org/licenses/by-sa/4.0/';
  protected ngss: NGSSStandards = new NGSSStandards();
  protected ngssWebUrl: string = 'https://www.nextgenscience.org/search-standards?keys=';
  protected parentAuthorsString: string = '';
  protected parentProject: ParentProject;
  protected project: Project;

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
      this.setNGSS();
      this.setLicenseInfo();
    }
  }

  private setNGSS(): void {
    const standards = this.project.metadata.standardsAddressed;
    if (standards) {
      const ngss = standards.ngss;
      if (ngss) {
        if (ngss.disciplines) {
          this.ngss.disciplines = ngss.disciplines;
        }
        if (ngss.dci) {
          this.ngss.dci = ngss.dci;
        }
        if (ngss.dciArrangements) {
          this.ngss.dciArrangements = ngss.dciArrangements;
        }
        if (ngss.ccc) {
          this.ngss.ccc = ngss.ccc;
        }
        if (ngss.practices) {
          this.ngss.practices = ngss.practices;
        }
      }
    }
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
    window.open(
      this.project.wiseVersion === 4
        ? `${this.configService.getWISE4Hostname()}` +
            `/previewproject.html?projectId=${this.project.id}`
        : `/preview/unit/${this.project.id}`
    );
  }
}
