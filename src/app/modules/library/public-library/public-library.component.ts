import { Component } from '@angular/core';
import { LibraryComponent } from '../library/library.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { LibraryProjectComponent } from '../library-project/library-project.component';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    LibraryProjectComponent,
    MatCheckboxModule,
    MatDividerModule,
    MatPaginatorModule
  ],
  selector: 'public-library',
  templateUrl: './public-library.component.html'
})
export class PublicLibraryComponent extends LibraryComponent {
  protected communityBuilt: boolean = false;
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
    this.filterValues.publicUnitTypeValue = [];
    if (this.wiseTested) {
      this.filterValues.publicUnitTypeValue.push('wiseTested');
    }
    if (this.communityBuilt) {
      this.filterValues.publicUnitTypeValue.push('communityBuilt');
    }
    this.filterUpdated();
  }

  protected getDetailsComponent(): any {
    return null;
  }
}
