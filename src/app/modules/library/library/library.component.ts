import { OnInit, QueryList, ViewChildren, Directive } from '@angular/core';
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
        this.isSearchMatch(project, this.searchValue) &&
        (!this.hasFilters() || this.isFilterMatch(project));
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

  private isFilterMatch(project: LibraryProject): boolean {
    return (
      this.matchesNgss(project) ||
      this.matchesDiscipline(project) ||
      this.matchesResearchProject(project)
    );
  }

  private matchesNgss(project: LibraryProject): boolean {
    return (
      project.metadata.standardsAddressed.ngss != null &&
      (this.matchesDciArrangement(project) || this.matchesPE(project))
    );
  }

  private matchesDciArrangement(project: LibraryProject): boolean {
    return (
      this.dciArrangementValue.length > 0 &&
      project.metadata.standardsAddressed.ngss.dciArrangements?.some((val) =>
        this.dciArrangementValue.includes(val.id)
      )
    );
  }

  private matchesPE(project: LibraryProject) {
    return (
      this.peValue.length > 0 &&
      project.metadata.standardsAddressed.ngss.dciArrangements?.some((arrangement) =>
        arrangement.children.some((val) => this.peValue.includes(val.id))
      )
    );
  }

  private matchesDiscipline(project: LibraryProject): boolean {
    return (
      this.disciplineValue.length > 0 &&
      project.metadata.disciplines?.some((discipline) =>
        this.disciplineValue.includes(discipline.id)
      )
    );
  }

  private matchesResearchProject(project: LibraryProject): boolean {
    return (
      this.researchProjectValue.length > 0 &&
      project.metadata.researchProjects?.some((researchProject) =>
        this.researchProjectValue.includes(researchProject)
      )
    );
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
