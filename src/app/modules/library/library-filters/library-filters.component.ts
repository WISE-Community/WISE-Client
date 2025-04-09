import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { LibraryProject } from '../libraryProject';
import { LibraryService } from '../../../services/library.service';
import { Standard } from '../standard';
import { Discipline } from '../Discipline';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';
import { UtilService } from '../../../services/util.service';
import { ResearchProject, ResearchProjectType } from '../ResearchProject';

@Component({
  selector: 'app-library-filters',
  styleUrl: './library-filters.component.scss',
  templateUrl: './library-filters.component.html',
  standalone: false
})
export class LibraryFiltersComponent implements OnInit {
  @Input()
  isSplitScreen: boolean = false;

  allProjects: LibraryProject[] = [];
  libraryProjects: LibraryProject[] = [];
  communityProjects: LibraryProject[] = [];
  sharedProjects: LibraryProject[] = [];
  personalProjects: LibraryProject[] = [];
  searchValue: string = '';
  protected disciplineOptions: Discipline[] = [];
  protected standardOptions: Standard[] = [];
  protected standardValue = [];
  disciplineValue = [];

  protected researchProjectOptions: ResearchProject[] = [];
  private researchProjectValue: ResearchProjectType[] = [];
  showFilters: boolean = false;

  constructor(
    private libraryService: LibraryService,
    private utilService: UtilService
  ) {
    libraryService.officialLibraryProjectsSource$.subscribe((libraryProjects: LibraryProject[]) => {
      this.libraryProjects = libraryProjects;
      this.populateFilterOptions();
    });
    libraryService.communityLibraryProjectsSource$.subscribe(
      (communityProjects: LibraryProject[]) => {
        this.communityProjects = communityProjects;
        this.populateFilterOptions();
      }
    );
    libraryService.sharedLibraryProjectsSource$.subscribe((sharedProjects: LibraryProject[]) => {
      this.sharedProjects = sharedProjects;
      this.populateFilterOptions();
    });
    libraryService.personalLibraryProjectsSource$.subscribe(
      (personalProjects: LibraryProject[]) => {
        this.personalProjects = personalProjects;
        this.populateFilterOptions();
      }
    );
  }

  ngOnInit() {
    const filterOptions: ProjectFilterValues = this.libraryService.getFilterValues();
    this.standardValue = filterOptions.standardValue;
    this.disciplineValue = filterOptions.disciplineValue;
    this.searchValue = filterOptions.searchValue;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.projects) {
      this.populateFilterOptions();
    }
  }

  populateFilterOptions(): void {
    this.allProjects = this.getAllProjects();
    this.standardOptions = [];
    this.disciplineOptions = [];
    for (let project of this.allProjects) {
      project.metadata.disciplines?.forEach((discipline: any) =>
        this.disciplineOptions.push(new Discipline(discipline.id, discipline.name))
      );
      const standards = project.metadata.standards;
      const ngss = standards?.ngss ?? [];
      const commonCore = standards?.commonCore ?? [];
      const learningForJustice = standards?.learningForJustice ?? [];
      [...ngss, ...commonCore, ...learningForJustice].forEach((standard: any) =>
        this.standardOptions.push(new Standard(standard.id, standard.name, standard.url))
      );
      this.populateResearchProjects(project);
    }
    this.removeDuplicatesAndSortAlphabetically();
  }

  private populateResearchProjects(project: LibraryProject): void {
    project.metadata.researchProjects?.forEach((researchProjectType: ResearchProjectType) => {
      if (!this.researchProjectOptions.map((option) => option.name).includes(researchProjectType)) {
        this.researchProjectOptions.push(new ResearchProject(researchProjectType));
      }
    });
  }

  getAllProjects() {
    return this.libraryProjects
      .concat(this.communityProjects)
      .concat(this.sharedProjects)
      .concat(this.personalProjects);
  }

  removeDuplicatesAndSortAlphabetically() {
    this.standardOptions = this.utilService.removeObjectArrayDuplicatesByProperty(
      this.standardOptions,
      'id'
    );
    this.utilService.sortObjectArrayByProperty(this.standardOptions, 'id');
    this.disciplineOptions = this.utilService.removeObjectArrayDuplicatesByProperty(
      this.disciplineOptions,
      'id'
    );
    this.utilService.sortObjectArrayByProperty(this.disciplineOptions, 'name');
  }

  hasFilters(): boolean {
    return this.standardValue.length > 0 || this.disciplineValue.length > 0;
  }

  searchUpdated(value: string): void {
    this.searchValue = value.toLocaleLowerCase();
    this.emitFilterValues();
  }

  filterUpdated(value: string[] | ResearchProjectType[] = [], context: string = ''): void {
    switch (context) {
      case 'discipline':
        this.disciplineValue = value;
        break;
      case 'standard':
        this.standardValue = value;
        break;
      case 'researchProject':
        this.researchProjectValue = value as ResearchProjectType[];
        break;
    }
    this.emitFilterValues();
  }

  emitFilterValues() {
    const filterOptions: ProjectFilterValues = {
      searchValue: this.searchValue,
      disciplineValue: this.disciplineValue,
      standardValue: this.standardValue,
      researchProjectValue: this.researchProjectValue
    };
    this.libraryService.setFilterValues(filterOptions);
  }

  clearFilterValues() {
    this.standardValue = [];
    this.disciplineValue = [];
    this.emitFilterValues();
  }
}
