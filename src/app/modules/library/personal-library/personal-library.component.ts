import { ApplyTagsButtonComponent } from '../../../teacher/apply-tags-button/apply-tags-button.component';
import { ArchiveProjectsButtonComponent } from '../../../teacher/archive-projects-button/archive-projects-button.component';
import { ArchiveProjectService } from '../../../services/archive-project.service';
import { BehaviorSubject } from 'rxjs';
import { Component, Signal, WritableSignal, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LibraryComponent } from '../library/library.component';
import { LibraryProject } from '../libraryProject';
import { LibraryProjectComponent } from '../library-project/library-project.component';
import { LibraryService } from '../../../services/library.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { Project } from '../../../domain/project';
import { ProjectSelectionEvent } from '../../../domain/projectSelectionEvent';
import { SelectAllItemsCheckboxComponent } from '../select-all-items-checkbox/select-all-items-checkbox.component';
import { SelectTagsComponent } from '../../../teacher/select-tags/select-tags.component';
import { Tag } from '../../../domain/tag';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';

@Component({
  imports: [
    ApplyTagsButtonComponent,
    ArchiveProjectsButtonComponent,
    FormsModule,
    LibraryProjectComponent,
    MatDividerModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSelectModule,
    SelectAllItemsCheckboxComponent,
    SelectTagsComponent
  ],
  selector: 'app-personal-library',
  styleUrl: './personal-library.component.scss',
  templateUrl: './personal-library.component.html'
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
  protected projectsLabel: string = $localize`Select all units`;
  protected selectedProjects: WritableSignal<LibraryProject[]> = signal([]);
  protected selectedTags: Tag[] = [];
  protected sharedProjects: LibraryProject[] = [];
  protected showArchivedView: boolean = false;

  constructor(
    private archiveProjectService: ArchiveProjectService,
    protected filterValues: ProjectFilterValues,
    protected libraryService: LibraryService
  ) {
    super(filterValues, libraryService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.subscriptions.add(
      this.libraryService.personalLibraryProjectsSource$.subscribe(
        (personalProjects: LibraryProject[]) => {
          if (history.state?.newProjectId) {
            personalProjects.find(
              (project) => project.id === history.state?.newProjectId
            ).isHighlighted = true;
          }
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

  private combinePersonalAndSharedProjects(): void {
    const projects = this.personalProjects.concat(this.sharedProjects);
    projects.sort(this.sortByProjectIdDesc);
    this.projects = projects;
  }

  private updateProjects(): void {
    this.combinePersonalAndSharedProjects();
    this.filterUpdated();
    this.unselectAllProjects();
  }

  private sortByProjectIdDesc(a, b): number {
    return b.id - a.id;
  }

  protected getNumVisiblePersonalOrPublicProjects(): BehaviorSubject<number> {
    return this.libraryService.numberOfPersonalProjectsVisible;
  }

  public filterUpdated(): void {
    super.filterUpdated();
    this.filteredProjects = this.filteredProjects.filter(
      (project) => project.hasTagWithText('archived') == this.showArchivedView
    );
    if (this.selectedTags.length > 0) {
      this.filteredProjects = this.filteredProjects.filter((project: Project) =>
        this.selectedTags.some((tag: Tag) => project.hasTag(tag))
      );
    }
    this.numProjectsInView = this.getProjectsInView().length;
    this.unselectAllProjects();
  }

  protected switchActiveArchivedView(): void {
    this.filterUpdated();
    this.unselectAllProjects();
  }

  protected pageChange(event?: PageEvent, scroll?: boolean): void {
    super.pageChange(event, scroll);
    this.unselectAllProjects();
  }

  protected updateSelectedProjects(event: ProjectSelectionEvent): void {
    const selectedProjects = this.selectedProjects();
    if (event.selected) {
      selectedProjects.push(event.project);
    } else {
      selectedProjects.splice(selectedProjects.indexOf(event.project), 1);
    }
    // create a new array to trigger change detection
    this.selectedProjects.set([...selectedProjects]);
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

  protected selectTags(tags: Tag[]): void {
    this.selectedTags = tags;
    this.filterUpdated();
  }

  protected removeTag(tag: Tag): void {
    this.selectedTags = this.selectedTags.filter((selectedTag: Tag) => selectedTag.id !== tag.id);
    this.filterUpdated();
  }
}
