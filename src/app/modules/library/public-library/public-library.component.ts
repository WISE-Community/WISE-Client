import { Component } from '@angular/core';
import { LibraryComponent } from '../library/library.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { LibraryProjectComponent } from '../library-project/library-project.component';
import { PublicUnitTypeSelectorComponent } from '../public-unit-type-selector/public-unit-type-selector.component';

@Component({
  imports: [
    CommonModule,
    LibraryProjectComponent,
    MatDividerModule,
    MatPaginatorModule,
    PublicUnitTypeSelectorComponent
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
  ngOnInit(): void {
    super.ngOnInit();
    this.subscriptions.add(
      this.libraryService.officialLibraryProjectsSource$.subscribe((projects) =>
        this.updateProjects(projects)
      )
    );
    this.subscriptions.add(
      this.libraryService.communityLibraryProjectsSource$.subscribe((projects) =>
        this.updateProjects(projects)
      )
    );
    this.libraryService.getOfficialLibraryProjects();
    this.libraryService.getCommunityLibraryProjects();
  }

  private updateProjects(projects: any): void {
    this.projects.push(...projects);
    this.filterUpdated();
  }

  protected emitNumberOfProjectsVisible(numProjectsVisible: number = null) {
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
