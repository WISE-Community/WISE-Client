import { Component, OnInit, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { LibraryProject } from '../libraryProject';
import { LibraryService } from '../../../services/library.service';
import { NGSSStandards } from '../ngssStandards';
import { ResearchProject, ResearchProjectTypes, Standard } from '../standard';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';
import { UtilService } from '../../../services/util.service';

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
  dciArrangementOptions: Standard[] = [];
  dciArrangementValue = [];
  disciplineOptions: Standard[] = [];
  disciplineValue = [];
  peOptions: Standard[] = [];
  peValue = [];
  protected researchProjectOptions: ResearchProject[] = [];
  private researchProjectValue: ResearchProjectTypes[] = [];
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
    this.dciArrangementValue = filterOptions.dciArrangementValue;
    this.disciplineValue = filterOptions.disciplineValue;
    this.peValue = filterOptions.peValue;
    this.searchValue = filterOptions.searchValue;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.projects) {
      this.populateFilterOptions();
    }
  }

  populateFilterOptions(): void {
    this.allProjects = this.getAllProjects();
    for (let project of this.allProjects) {
      project.metadata.disciplines?.forEach((discipline: any) =>
        this.disciplineOptions.push(this.createDisciplineStandard(discipline))
      );
      const standardsAddressed = project.metadata.standardsAddressed;
      if (standardsAddressed && standardsAddressed.ngss) {
        const ngss: NGSSStandards = standardsAddressed.ngss;
        const dciArrangements = ngss.dciArrangements;
        for (let dciStandard of dciArrangements) {
          this.dciArrangementOptions.push(this.createDCIStandard(dciStandard));
          if (dciStandard.children) {
            for (let peStandard of dciStandard.children) {
              this.peOptions.push(this.createPEStandard(peStandard));
            }
          }
        }
      }
      this.populateResearchProjects(project);
    }
    this.removeDuplicatesAndSortAlphabetically();
  }

  private populateResearchProjects(project: LibraryProject): void {
    project.metadata.researchProjects?.forEach((researchProjectTypes: ResearchProjectTypes) => {
      const researchProject: ResearchProject = {
        id: researchProjectTypes,
        name: researchProjectTypes,
        children: []
      };
      if (!this.researchProjectOptions.map((option) => option.id).includes(researchProject.id)) {
        this.researchProjectOptions.push(researchProject);
      }
    });
  }

  getAllProjects() {
    return this.libraryProjects
      .concat(this.communityProjects)
      .concat(this.sharedProjects)
      .concat(this.personalProjects);
  }

  createDCIStandard(standardIn: any) {
    const dciStandard: Standard = new Standard();
    dciStandard.id = standardIn.id;
    dciStandard.name = `${standardIn.id} ${standardIn.name}`;
    return dciStandard;
  }

  createPEStandard(standardIn: any) {
    const peStandard: Standard = new Standard();
    peStandard.id = standardIn.id;
    peStandard.name = `${standardIn.id}: ${standardIn.name}`;
    return peStandard;
  }

  createDisciplineStandard(standardIn: any) {
    const standard: Standard = new Standard();
    standard.id = standardIn.id;
    standard.name = standardIn.name;
    return standard;
  }

  removeDuplicatesAndSortAlphabetically() {
    this.dciArrangementOptions = this.utilService.removeObjectArrayDuplicatesByProperty(
      this.dciArrangementOptions,
      'id'
    );
    this.utilService.sortObjectArrayByProperty(this.dciArrangementOptions, 'id');
    this.disciplineOptions = this.utilService.removeObjectArrayDuplicatesByProperty(
      this.disciplineOptions,
      'id'
    );
    this.utilService.sortObjectArrayByProperty(this.disciplineOptions, 'name');
    this.peOptions = this.utilService.removeObjectArrayDuplicatesByProperty(this.peOptions, 'id');
    this.utilService.sortObjectArrayByProperty(this.peOptions, 'id');
  }

  hasFilters(): boolean {
    return (
      this.dciArrangementValue.length > 0 ||
      this.peValue.length > 0 ||
      this.disciplineValue.length > 0
    );
  }

  searchUpdated(value: string): void {
    this.searchValue = value.toLocaleLowerCase();
    this.emitFilterValues();
  }

  filterUpdated(value: string[] | ResearchProjectTypes[] = [], context: string = ''): void {
    switch (context) {
      case 'discipline':
        this.disciplineValue = value;
        break;
      case 'dci':
        this.dciArrangementValue = value;
        break;
      case 'pe':
        this.peValue = value;
        break;
      case 'researchProject':
        this.researchProjectValue = value as ResearchProjectTypes[];
        break;
    }
    this.emitFilterValues();
  }

  emitFilterValues() {
    const filterOptions: ProjectFilterValues = {
      searchValue: this.searchValue,
      disciplineValue: this.disciplineValue,
      dciArrangementValue: this.dciArrangementValue,
      peValue: this.peValue,
      researchProjectValue: this.researchProjectValue
    };
    this.libraryService.setFilterValues(filterOptions);
  }

  clearFilterValues() {
    this.dciArrangementValue = [];
    this.disciplineValue = [];
    this.peValue = [];
    this.emitFilterValues();
  }
}
