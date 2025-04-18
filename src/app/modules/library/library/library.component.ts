import { OnInit, QueryList, ViewChildren, Directive } from '@angular/core';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';
import { LibraryService } from '../../../services/library.service';
import { Standard } from '../standard';
import { LibraryProject } from '../libraryProject';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Feature } from '../Feature';
import { GradeLevel } from '../GradeLevel';

@Directive()
export abstract class LibraryComponent implements OnInit {
  protected standardOptions: Standard[] = [];
  protected disciplineOptions: Standard[] = [];
  protected featureOptions: Feature[] = [];
  protected filteredProjects: LibraryProject[] = [];
  protected filterValues: ProjectFilterValues = new ProjectFilterValues();
  protected gradeLevelOptions: GradeLevel[] = [];
  protected highIndex: number = 0;
  protected lowIndex: number = 0;
  protected pageSizeOptions: number[] = [12, 24, 48, 96];
  protected pageIndex: number = 0;
  protected pageSize: number = 12;
  @ViewChildren(MatPaginator) paginators!: QueryList<MatPaginator>;
  protected projects: LibraryProject[] = [];
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
    this.projects.forEach((project) => {
      project.visible = this.filterValues.matches(project);
      if (project.visible) {
        this.filteredProjects.push(project);
      }
    });
    this.filteredProjects.sort((a, b) => a.metadata.title.localeCompare(b.metadata.title));
    this.emitNumberOfProjectsVisible(this.countVisibleProjects(this.filteredProjects));
    this.pageIndex = 0;
    this.setPagination();
  }

  protected abstract emitNumberOfProjectsVisible(numProjectsVisible: number): void;

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
