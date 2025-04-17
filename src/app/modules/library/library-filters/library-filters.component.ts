import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { LibraryProject } from '../libraryProject';
import { LibraryService } from '../../../services/library.service';
import { Standard, StandardType } from '../standard';
import { Discipline } from '../Discipline';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';
import { UtilService } from '../../../services/util.service';
import { ResearchProject, ResearchProjectType } from '../ResearchProject';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { SelectMenuComponent } from '../../shared/select-menu/select-menu.component';
import { StandardsSelectMenuComponent } from '../../shared/standards-select-menu/standards-select-menu.component';

@Component({
  imports: [
    CommonModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    SearchBarComponent,
    SelectMenuComponent,
    StandardsSelectMenuComponent
  ],
  selector: 'app-library-filters',
  styleUrl: './library-filters.component.scss',
  templateUrl: './library-filters.component.html'
})
export class LibraryFiltersComponent implements OnInit {
  private allProjects: LibraryProject[] = [];
  private communityProjects: LibraryProject[] = [];
  protected disciplineOptions: Discipline[] = [];
  protected disciplineValue = [];
  @Input() isSplitScreen: boolean = false;
  private libraryProjects: LibraryProject[] = [];
  private personalProjects: LibraryProject[] = [];
  protected possibleStandardLabels = ['NGSS', 'Common Core', 'Learning For Justice'];
  protected researchProjectOptions: ResearchProject[] = [];
  private researchProjectValue: ResearchProjectType[] = [];
  protected searchValue: string = '';
  private sharedProjects: LibraryProject[] = [];
  protected showFilters: boolean = false;
  protected standardOptions: Standard[] = [];
  protected standardValue = [];

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

  ngOnInit(): void {
    const filterOptions: ProjectFilterValues = this.libraryService.getFilterValues();
    this.standardValue = filterOptions.standardValue;
    this.disciplineValue = filterOptions.disciplineValue;
    this.searchValue = filterOptions.searchValue;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.projects) {
      this.populateFilterOptions();
    }
  }

  private populateFilterOptions(): void {
    this.allProjects = this.getAllProjects();
    this.standardOptions = [];
    this.disciplineOptions = [];
    for (let project of this.allProjects) {
      project.metadata.disciplines?.forEach((discipline: any) =>
        this.disciplineOptions.push(new Discipline(discipline.id, discipline.name))
      );
      const standards = project.metadata.standards;
      [
        ['ngss', 'NGSS'],
        ['commonCore', 'Common Core'],
        ['learningForJustice', 'Learning For Justice']
      ].forEach(([key, name]) => {
        (standards?.[key] ?? []).forEach((standard: any) =>
          this.standardOptions.push(
            new Standard(standard.id, standard.name, name as StandardType, standard.url)
          )
        );
      });
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

  private getAllProjects(): LibraryProject[] {
    return this.libraryProjects
      .concat(this.communityProjects)
      .concat(this.sharedProjects)
      .concat(this.personalProjects);
  }

  private removeDuplicatesAndSortAlphabetically(): void {
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

  protected hasFilters(): boolean {
    return (
      this.standardValue.length > 0 || this.disciplineValue.length > 0 || this.searchValue !== ''
    );
  }

  protected searchUpdated(value: string): void {
    this.searchValue = value.toLocaleLowerCase();
    this.emitFilterValues();
  }

  protected filterUpdated(
    value: string[] | ResearchProjectType[] = [],
    context: string = ''
  ): void {
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

  private emitFilterValues(): void {
    const filterOptions: ProjectFilterValues = {
      searchValue: this.searchValue,
      disciplineValue: this.disciplineValue,
      standardValue: this.standardValue,
      researchProjectValue: this.researchProjectValue
    };
    this.libraryService.setFilterValues(filterOptions);
  }

  protected clearFilterValues(): void {
    this.standardValue = [];
    this.disciplineValue = [];
    this.emitFilterValues();
  }
}
