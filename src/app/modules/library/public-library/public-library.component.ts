import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LibraryComponent } from '../library/library.component';
import { LibraryProject } from '../libraryProject';
import { LibraryProjectComponent } from '../library-project/library-project.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';
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

  protected filterUpdated(filterValues: ProjectFilterValues = null): void {
    if (filterValues) {
      // this check is required the very first time when filterValues is null
      filterValues.publicUnitTypeValue = this.filterValues.publicUnitTypeValue;
    }
    super.filterUpdated(filterValues);
  }

  protected getNumVisiblePersonalOrPublicProjects(): BehaviorSubject<number> {
    return this.libraryService.numberOfPublicProjectsVisible;
  }

  protected getDetailsComponent(): any {
    return null;
  }
}
