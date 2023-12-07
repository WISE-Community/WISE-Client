import { Component, Inject, Signal, WritableSignal, computed, signal } from '@angular/core';
import { LibraryProject } from '../libraryProject';
import { LibraryService } from '../../../services/library.service';
import { LibraryComponent } from '../library/library.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';
import { ArchiveProjectService } from '../../../services/archive-project.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-personal-library',
  templateUrl: './personal-library.component.html',
  styleUrls: ['./personal-library.component.scss']
})
export class PersonalLibraryComponent extends LibraryComponent {
  filteredProjects: LibraryProject[] = [];
  protected personalProjects: LibraryProject[] = [];
  projects: LibraryProject[] = [];
  protected selectedProjects: WritableSignal<LibraryProject[]> = signal([]);
  protected sharedProjects: LibraryProject[] = [];
  protected showArchived: boolean = false;

  protected numSelectedProjects: Signal<number> = computed(() => {
    return this.selectedProjects().length;
  });
  protected projectIdToIsSelected: Signal<any> = computed(() => {
    return this.selectedProjects().reduce((accumulator, project) => {
      accumulator[project.id] = true;
      return accumulator;
    }, {});
  });
  protected selectedAllProjects: Signal<boolean> = computed(() => {
    const numSelectedProjects = this.numSelectedProjects();
    return numSelectedProjects !== 0 && numSelectedProjects === this.getProjectsInView().length;
  });
  protected selectedSomeProjects: Signal<boolean> = computed(() => {
    return this.numSelectedProjects() !== 0 && !this.selectedAllProjects();
  });

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
    this.clearSelectedProjects();
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
      (project) => project.tags.includes('archived') == this.showArchived
    );
  }

  protected switchActiveArchivedView(): void {
    this.filterUpdated();
    this.clearSelectedProjects();
  }

  pageChange(event?: PageEvent, scroll?: boolean): void {
    super.pageChange(event, scroll);
    this.clearSelectedProjects();
  }

  protected projectSelectionChanged(event: any): void {
    if (event.checked) {
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

  protected archiveSelectedProjects(archive: boolean): Subscription {
    return this.archiveProjectService[archive ? 'archiveProjects' : 'unarchiveProjects'](
      this.selectedProjects()
    ).subscribe({
      next: () => {
        this.archiveProjectService.showArchiveProjectsSuccessMessage(
          this.selectedProjects(),
          archive
        );
        this.archiveProjectService.updateProjectsArchivedStatus(this.selectedProjects(), archive);
        this.clearSelectedProjects();
      },
      error: () => {
        this.archiveProjectService.showArchiveProjectErrorMessage(archive);
      }
    });
  }

  private clearSelectedProjects(): void {
    this.selectAllProjectsChanged(false);
  }

  protected selectAllProjectsChanged(selectAll: any): void {
    this.selectedProjects.update(() => (selectAll ? this.getProjectsInView() : []));
  }

  private getProjectsInView(): LibraryProject[] {
    return this.filteredProjects.filter(
      (project, index) => this.lowIndex <= index && index < this.highIndex
    );
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
