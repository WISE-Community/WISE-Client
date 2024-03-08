import { Component, Inject, Signal, WritableSignal, computed, signal } from '@angular/core';
import { LibraryProject } from '../libraryProject';
import { LibraryService } from '../../../services/library.service';
import { LibraryComponent } from '../library/library.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';
import { ArchiveProjectService } from '../../../services/archive-project.service';
import { PageEvent } from '@angular/material/paginator';
import { ProjectSelectionEvent } from '../../../domain/projectSelectionEvent';

@Component({
  selector: 'app-personal-library',
  templateUrl: './personal-library.component.html',
  styleUrls: ['./personal-library.component.scss']
})
export class PersonalLibraryComponent extends LibraryComponent {
  filteredProjects: LibraryProject[] = [];
  protected numProjectsInView: number;
  protected numSelectedProjects: Signal<number> = computed(() => this.selectedProjects().length);
  protected personalProjects: LibraryProject[] = [];
  protected projectIdToIsSelected: Signal<{ [key: number]: boolean }> = computed(() =>
    this.selectedProjects().reduce((accumulator, project) => {
      accumulator[project.id] = true;
      return accumulator;
    }, {})
  );
  projects: LibraryProject[] = [];
  protected projectsLabel: string = $localize`units`;
  protected selectedProjects: WritableSignal<LibraryProject[]> = signal([]);
  protected sharedProjects: LibraryProject[] = [];
  protected showArchivedView: boolean = false;

  constructor(
    private archiveProjectService: ArchiveProjectService,
    protected dialog: MatDialog,
    protected libraryService: LibraryService
  ) {
    super(dialog, libraryService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.subscriptions.add(
      this.libraryService.personalLibraryProjectsSource$.subscribe(
        (personalProjects: LibraryProject[]) => {
          this.personalProjects = personalProjects;
          this.updateProjects();
        }
      )
    );
    this.subscriptions.add(
      this.libraryService.sharedLibraryProjectsSource$.subscribe(
        (sharedProjects: LibraryProject[]) => {
          this.sharedProjects = sharedProjects;
          this.updateProjects();
        }
      )
    );
    this.subscriptions.add(
      this.libraryService.newProjectSource$.subscribe((project) => {
        if (project) {
          project.isHighlighted = true;
          this.projects.unshift(project);
          this.filterUpdated();
        }
      })
    );
    this.subscribeToRefreshProjects();
  }

  private subscribeToRefreshProjects(): void {
    this.subscriptions.add(
      this.archiveProjectService.refreshProjectsEvent$.subscribe(() => {
        this.updateProjects();
      })
    );
  }

  combinePersonalAndSharedProjects() {
    const projects = this.personalProjects.concat(this.sharedProjects);
    projects.sort(this.sortByProjectIdDesc);
    this.projects = projects;
  }

  updateProjects() {
    this.combinePersonalAndSharedProjects();
    this.filterUpdated();
    this.unselectAllProjects();
  }

  sortByProjectIdDesc(a, b) {
    if (a.id < b.id) {
      return 1;
    } else if (a.id > b.id) {
      return -1;
    } else {
      return 0;
    }
  }

  emitNumberOfProjectsVisible(numProjectsVisible: number = null) {
    if (numProjectsVisible) {
      this.libraryService.numberOfPersonalProjectsVisible.next(numProjectsVisible);
    } else {
      this.libraryService.numberOfPersonalProjectsVisible.next(this.filteredProjects.length);
    }
  }

  protected getDetailsComponent(): any {
    return PersonalLibraryDetailsComponent;
  }

  public filterUpdated(filterValues: ProjectFilterValues = null): void {
    super.filterUpdated(filterValues);
    this.filteredProjects = this.filteredProjects.filter(
      (project) => project.hasTag('archived') == this.showArchivedView
    );
    this.numProjectsInView = this.getProjectsInView().length;
    this.unselectAllProjects();
  }

  protected switchActiveArchivedView(): void {
    this.filterUpdated();
    this.unselectAllProjects();
  }

  pageChange(event?: PageEvent, scroll?: boolean): void {
    super.pageChange(event, scroll);
    this.unselectAllProjects();
  }

  protected updateSelectedProjects(event: ProjectSelectionEvent): void {
    if (event.selected) {
      this.selectedProjects.update((selectedProjects) => {
        selectedProjects.push(event.project);
        return selectedProjects;
      });
    } else {
      this.selectedProjects.update((selectedProjects) => {
        selectedProjects.splice(selectedProjects.indexOf(event.project), 1);
        return selectedProjects;
      });
    }
  }

  protected refreshProjects(): void {
    this.unselectAllProjects();
    this.archiveProjectService.refreshProjects();
  }

  protected unselectAllProjects(): void {
    this.projects.forEach((project) => (project.selected = false));
    this.selectedProjects.set([]);
  }

  protected selectAllProjects(): void {
    const projects = this.getProjectsInView();
    projects.forEach((project) => (project.selected = true));
    this.selectedProjects.set(projects);
  }

  private getProjectsInView(): LibraryProject[] {
    return this.filteredProjects.filter(
      (project, index) => this.lowIndex <= index && index < this.highIndex
    );
  }

  protected archiveProjects(archive: boolean): void {
    this.archiveProjectService.archiveProjects(this.selectedProjects(), archive);
  }
}

@Component({
  selector: 'personal-library-details',
  templateUrl: 'personal-library-details.html'
})
export class PersonalLibraryDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<PersonalLibraryDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
