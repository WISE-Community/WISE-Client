import { EventEmitter, OnInit, Output, QueryList, ViewChildren, Directive } from '@angular/core';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';
import { LibraryService } from '../../../services/library.service';
import { ResearchProjectTypes, Standard } from '../standard';
import { LibraryProject } from '../libraryProject';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Directive()
export abstract class LibraryComponent implements OnInit {
  protected dciArrangementOptions: Standard[] = [];
  protected dciArrangementValue = [];
  protected disciplineOptions: Standard[] = [];
  protected disciplineValue = [];
  protected filteredProjects: LibraryProject[] = [];
  protected filterValues: ProjectFilterValues = new ProjectFilterValues();
  protected highIndex: number = 0;
  protected lowIndex: number = 0;
  protected pageSizeOptions: number[] = [12, 24, 48, 96];
  protected pageIndex: number = 0;
  protected pageSize: number = 12;
  @ViewChildren(MatPaginator) paginators!: QueryList<MatPaginator>;
  protected peOptions: Standard[] = [];
  protected peValue = [];
  protected projects: LibraryProject[] = [];
  private researchProjectValue: ResearchProjectTypes[] = [];
  protected searchValue: string = '';
  protected showFilters: boolean = false;
  protected subscriptions: Subscription = new Subscription();

  constructor(
    protected dialog: MatDialog,
    protected libraryService: LibraryService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.libraryService.projectFilterValuesSource$.subscribe((projectFilterValues) =>
        this.filterUpdated(projectFilterValues)
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected pageChange(event?: PageEvent, scroll?: boolean): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.setPagination();
    if (scroll) {
      document.querySelector('.library').scrollIntoView();
    }
  }

  private setPagination(): void {
    if (this.paginators) {
      this.paginators.toArray().forEach((paginator) => (paginator.pageIndex = this.pageIndex));
      this.setPageBounds();
    }
  }

  private setPageBounds(): void {
    this.lowIndex = this.pageIndex * this.pageSize;
    this.highIndex = this.lowIndex + this.pageSize;
  }

  protected isOnPage(index: number): boolean {
    return this.lowIndex <= index && index < this.highIndex;
  }

  filterUpdated(filterValues: ProjectFilterValues = null): void {
    if (filterValues) {
      this.filterValues = filterValues;
    }
    this.filteredProjects = [];
    this.searchValue = this.filterValues.searchValue;
    this.disciplineValue = this.filterValues.disciplineValue;
    this.dciArrangementValue = this.filterValues.dciArrangementValue;
    this.researchProjectValue = this.filterValues.researchProjectValue;
    this.peValue = this.filterValues.peValue;
    this.projects.forEach((project) => {
      project.visible =
        this.isSearchMatch(project, this.searchValue) && this.isFilterMatch(project);
      if (project.visible) {
        this.filteredProjects.push(project);
      }
    });
    this.emitNumberOfProjectsVisible(this.countVisibleProjects(this.filteredProjects));
    this.pageIndex = 0;
    this.setPagination();
  }

  protected abstract emitNumberOfProjectsVisible(numProjectsVisible: number): void;

  private isSearchMatch(project: LibraryProject, searchValue: string): boolean {
    project.metadata.id = project.id;
    return (
      !searchValue ||
      Object.keys(project.metadata)
        .filter((prop) =>
          // only check for match in specific metadata fields
          ['title', 'summary', 'keywords', 'features', 'standardsAddressed', 'id'].includes(prop)
        )
        .some((prop) => {
          let value = project.metadata[prop];
          if (prop === 'standardsAddressed') {
            value = JSON.stringify(value);
          }
          return (
            typeof value !== 'undefined' &&
            value != null &&
            value.toString().toLocaleLowerCase().indexOf(searchValue) !== -1
          );
        })
    );
  }

  protected isFilterMatch(project: LibraryProject): boolean {
    if (this.hasFilters()) {
      const standardsAddressed = project.metadata.standardsAddressed;
      if (standardsAddressed.ngss) {
        const ngss = standardsAddressed.ngss;
        if (this.dciArrangementValue.length) {
          const dciArrangements: Standard[] = ngss.dciArrangements ? ngss.dciArrangements : [];
          for (let val of dciArrangements) {
            for (let filter of this.dciArrangementValue) {
              if (val.id === filter) {
                return true;
              }
            }
          }
        }
        if (this.peValue.length) {
          const dciArrangements: Standard[] = ngss.dciArrangements ? ngss.dciArrangements : [];
          for (let arrangement of dciArrangements) {
            for (let val of arrangement.children) {
              for (let filter of this.peValue) {
                if (val.id === filter) {
                  return true;
                }
              }
            }
          }
        }
        if (this.disciplineValue.length) {
          const disciplines: Standard[] = ngss.disciplines ? ngss.disciplines : [];
          for (let val of disciplines) {
            for (let filter of this.disciplineValue) {
              if (val.id === filter) {
                return true;
              }
            }
          }
        }
      }
      if (this.researchProjectValue.length > 0) {
        const researchProjects: ResearchProjectTypes[] = project.metadata.researchProjects ?? [];
        if (
          researchProjects.some((researchProject) =>
            this.researchProjectValue.includes(researchProject)
          )
        ) {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  }

  private hasFilters(): boolean {
    return (
      this.dciArrangementValue.length +
        this.peValue.length +
        this.disciplineValue.length +
        this.researchProjectValue.length >
      0
    );
  }

  protected countVisibleProjects(projects: LibraryProject[]): number {
    return projects.filter((project) => project.visible).length;
  }

  protected showInfo(event: Event): void {
    event.preventDefault();
    this.dialog.open(this.getDetailsComponent(), {
      panelClass: 'dialog-sm'
    });
  }

  protected abstract getDetailsComponent(): any;
}
