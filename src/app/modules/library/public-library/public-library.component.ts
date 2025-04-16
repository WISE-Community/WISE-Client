import { Component } from '@angular/core';
import { LibraryComponent } from '../library/library.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { LibraryProjectComponent } from '../library-project/library-project.component';

@Component({
  imports: [CommonModule, LibraryProjectComponent, MatDividerModule, MatPaginatorModule],
  selector: 'public-library',
  templateUrl: './public-library.component.html'
})
export class PublicLibraryComponent extends LibraryComponent {
  ngOnInit() {
    super.ngOnInit();
    this.subscriptions.add(
      this.libraryService.communityLibraryProjectsSource$.subscribe((communityProjects) => {
        this.projects.push(...communityProjects);
        this.filterUpdated();
      })
    );
    this.subscriptions.add(
      this.libraryService.officialLibraryProjectsSource$.subscribe((libraryProjects) => {
        this.projects.push(...libraryProjects);
        this.filterUpdated();
      })
    );
    this.libraryService.getOfficialLibraryProjects();
    this.libraryService.getCommunityLibraryProjects();
  }

  emitNumberOfProjectsVisible(numProjectsVisible: number = null) {
    if (numProjectsVisible) {
      this.libraryService.numberOfCommunityProjectsVisible.next(numProjectsVisible);
    } else {
      this.libraryService.numberOfCommunityProjectsVisible.next(this.filteredProjects.length);
    }
  }

  protected getDetailsComponent(): any {
    return null;
  }
}
