import { BehaviorSubject } from 'rxjs';
import { Component } from '@angular/core';
import { LibraryComponent } from '../library/library.component';
import { LibraryProject } from '../libraryProject';
import { LibraryProjectComponent } from '../library-project/library-project.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PublicUnitTypeSelectorComponent } from '../public-unit-type-selector/public-unit-type-selector.component';

@Component({
  imports: [
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
        border-radius: 0;
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
  }

  private updateProjects(projects: LibraryProject[]): void {
    this.projects.push(...projects);
    this.projects = this.removeDuplicates(this.projects);
    this.filterUpdated();
  }

  private removeDuplicates(projects: LibraryProject[]): LibraryProject[] {
    return projects.reduce((acc, project) => {
      if (!acc.some((p) => p.id === project.id)) {
        acc.push(project);
      }
      return acc;
    }, []);
  }

  protected getNumVisiblePersonalOrPublicProjects(): BehaviorSubject<number> {
    return this.libraryService.numberOfPublicProjectsVisible;
  }
}
