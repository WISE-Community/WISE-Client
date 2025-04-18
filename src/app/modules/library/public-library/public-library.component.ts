import { Component } from '@angular/core';
import { LibraryComponent } from '../library/library.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { LibraryProjectComponent } from '../library-project/library-project.component';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    LibraryProjectComponent,
    MatCheckboxModule,
    MatDividerModule,
    MatIconModule,
    MatPaginatorModule
  ],
  selector: 'public-library',
  styles: [
    `
      .content-block {
        padding: 16px;
      }

      .mat-mdc-paginator {
        background-color: transparent;
      }

      .mat-divider {
        margin: 0;
      }

      .library__list {
        padding: 8px 0;
      }
    `
  ],
  templateUrl: './public-library.component.html'
})
export class PublicLibraryComponent extends LibraryComponent {
  protected communityBuilt: boolean = false;
  protected infoToShow: 'community' | 'official' = 'official';
  protected wiseTested: boolean = false;

  ngOnInit() {
    super.ngOnInit();
    this.subscriptions.add(
      this.libraryService.officialLibraryProjectsSource$.subscribe((libraryProjects) => {
        libraryProjects.forEach((project) => (project.metadata.publicUnitType = 'wiseTested'));
        this.projects.push(...libraryProjects);
        this.filterUpdated();
      })
    );
    this.subscriptions.add(
      this.libraryService.communityLibraryProjectsSource$.subscribe((communityProjects) => {
        communityProjects.forEach(
          (project) => (project.metadata.publicUnitType = 'communityBuilt')
        );
        this.projects.push(...communityProjects);
        this.filterUpdated();
      })
    );
    this.libraryService.getOfficialLibraryProjects();
    this.libraryService.getCommunityLibraryProjects();
  }

  protected emitNumberOfProjectsVisible(numProjectsVisible: number = null) {
    if (numProjectsVisible) {
      this.libraryService.numberOfCommunityProjectsVisible.next(numProjectsVisible);
    } else {
      this.libraryService.numberOfCommunityProjectsVisible.next(this.filteredProjects.length);
    }
  }

  protected updatePublicUnitType(): void {
    this.publicUnitTypeValue = [];
    if (this.wiseTested) {
      this.publicUnitTypeValue.push('wiseTested');
    }
    if (this.communityBuilt) {
      this.publicUnitTypeValue.push('communityBuilt');
    }
    this.filterUpdated();
  }

  protected showOfficialLibraryInfo($event): void {
    this.infoToShow = 'official';
    this.showInfo($event);
  }

  protected showCommunityLibraryInfo($event): void {
    this.infoToShow = 'community';
    this.showInfo($event);
  }

  protected getDetailsComponent(): any {
    return this.infoToShow === 'official' ? OfficialDetailsComponent : CommunityDetailsComponent;
  }
}

@Component({
  selector: 'community-details',
  templateUrl: '../community-library/community-library-details.html',
  imports: [MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, RouterLink]
})
export class CommunityDetailsComponent {
  constructor(public dialogRef: MatDialogRef<CommunityDetailsComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'official-details',
  templateUrl: '../official-library/official-library-details.html',
  imports: [MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, RouterLink]
})
export class OfficialDetailsComponent {
  constructor(public dialogRef: MatDialogRef<OfficialDetailsComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
