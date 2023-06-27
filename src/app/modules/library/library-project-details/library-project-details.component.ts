import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { CreateRunDialogComponent } from '../../../teacher/create-run-dialog/create-run-dialog.component';
import { NGSSStandards } from '../ngssStandards';
import { Project } from '../../../domain/project';
import { ParentProject } from '../../../domain/parentProject';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'app-library-project-details',
  templateUrl: './library-project-details.component.html',
  styleUrls: ['./library-project-details.component.scss']
})
export class LibraryProjectDetailsComponent implements OnInit {
  isTeacher: boolean = false;
  isRunProject: false;
  ngss: NGSSStandards = new NGSSStandards();
  ngssWebUrl: string = 'https://www.nextgenscience.org/search-standards?keys=';
  project: Project;
  parentProject: ParentProject;
  licenseUrl = 'http://creativecommons.org/licenses/by-sa/4.0/';
  licenseInfo = $localize`License pertains to original content created by the author(s). Authors are responsible for the usage and attribution of any third-party content linked to or included in this work.`;
  license: string = '';
  authorsString: string = '';
  parentAuthorsString: string = '';
  more: boolean = false;
  isCopy: boolean = false;
  discourseURL: string = '';
  topics: any[] = [];
  postCount: number = 0;
  hasMoreTopics: boolean = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<LibraryProjectDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private configService: ConfigService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.isTeacher = this.userService.isTeacher();
    this.isRunProject = this.data.isRunProject;
    if (this.data.project) {
      this.project = new Project(this.data.project);
      const numParents = this.data.project.metadata.parentProjects
        ? this.data.project.metadata.parentProjects.length
        : null;
      if (numParents) {
        this.parentProject = new ParentProject(
          this.data.project.metadata.parentProjects[numParents - 1]
        );
      }
      this.setNGSS();
      this.setLicenseInfo();
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  setNGSS(): void {
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

  setLicenseInfo(): void {
    this.authorsString = this.getAuthorsString(this.project.metadata.authors);
    if (this.parentProject) {
      this.parentAuthorsString = this.getAuthorsString(this.parentProject.authors);
      if (!this.authorsString) {
        this.isCopy = true;
      }
    }
  }

  getAuthorsString(authors: any[]): string {
    if (!authors) {
      return '';
    }
    return authors
      .map((author) => {
        return `${author.firstName} ${author.lastName}`;
      })
      .join(', ');
  }

  runProject() {
    this.dialog.open(CreateRunDialogComponent, {
      data: this.data,
      panelClass: 'dialog-md',
      disableClose: true
    });
    this.dialogRef.close();
  }

  previewProject() {
    if (this.project.wiseVersion === 4) {
      window.open(
        `${this.configService.getWISE4Hostname()}` +
          `/previewproject.html?projectId=${this.project.id}`
      );
    } else {
      window.open(`/preview/unit/${this.project.id}`);
    }
  }
}
