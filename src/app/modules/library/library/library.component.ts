import { OnInit, QueryList, ViewChildren, Directive } from '@angular/core';
import { LibraryService } from '../../../services/library.service';
import { LibraryProject } from '../libraryProject';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';

@Directive()
export abstract class LibraryComponent implements OnInit {
  protected filteredProjects: LibraryProject[] = [];
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
    protected filterValues: ProjectFilterValues,
    protected libraryService: LibraryService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(this.filterValues.updated$.subscribe(() => this.filterUpdated()));
  }

  ngOnDestroy(): void {
    this.filterValues.clear();
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

  protected filterUpdated(): void {
    this.filteredProjects = this.projects
      .map((project) => {
        project.visible = this.filterValues.matches(project);
        return project;
      })
      .filter((project) => project.visible)
      .sort(this.sortUnits);
    this.emitNumberOfProjectsVisible(this.countVisibleProjects(this.filteredProjects));
    this.pageIndex = 0;
    this.setPagination();
  }

  protected emitNumberOfProjectsVisible(numProjectsVisible: number): void {
    if (numProjectsVisible) {
      this.getNumVisiblePersonalOrPublicProjects().next(numProjectsVisible);
    } else {
      this.getNumVisiblePersonalOrPublicProjects().next(this.filteredProjects.length);
    }
  }

  protected abstract getNumVisiblePersonalOrPublicProjects(): BehaviorSubject<number>;

  protected countVisibleProjects(projects: LibraryProject[]): number {
    return projects.filter((project) => project.visible).length;
  }

  // Sort units from newest -> oldest in each of these categories
  // WISE Tested (Platform) -> WISE Tested (Other) -> Community (Platform) -> Community (Other)
  private sortUnits(a: LibraryProject, b: LibraryProject): number {
    const unitTypes = [
      'wiseTestedPlatform',
      'wiseTestedOther',
      'communityBuiltPlatform',
      'communityBuiltOther'
    ];
    const unitTypeIndexA = unitTypes.indexOf(a.metadata.publicUnitType + a.metadata.unitType);
    const unitTypeIndexB = unitTypes.indexOf(b.metadata.publicUnitType + b.metadata.unitType);
    return unitTypeIndexA === unitTypeIndexB ? b.id - a.id : unitTypeIndexA - unitTypeIndexB;
  }
}
