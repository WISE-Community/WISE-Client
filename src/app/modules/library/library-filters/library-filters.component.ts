import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { LibraryProject } from '../libraryProject';
import { LibraryService } from '../../../services/library.service';
import { Standard, StandardType } from '../standard';
import { Discipline } from '../Discipline';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';
import { UtilService } from '../../../services/util.service';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { SelectMenuComponent } from '../../shared/select-menu/select-menu.component';
import { StandardsSelectMenuComponent } from '../../shared/standards-select-menu/standards-select-menu.component';
import { Feature } from '../Feature';
import { Grade, GradeLevel } from '../GradeLevel';

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
  private communityProjects: LibraryProject[] = [];
  protected disciplineOptions: Discipline[] = [];
  protected disciplineValue = [];
  protected featureOptions: Feature[] = [];
  protected featureValue = [];
  protected gradeLevelOptions: GradeLevel[] = [];
  protected gradeLevelValue = [];
  @Input() showAdvancedFilteringOptions: boolean = true;
  @Input() isSplitScreen: boolean = false;
  private libraryProjects: LibraryProject[] = [];
  private personalProjects: LibraryProject[] = [];
  protected possibleStandardLabels = ['NGSS', 'Common Core', 'Learning For Justice'];
  protected searchValue: string = '';
  private sharedProjects: LibraryProject[] = [];
  protected showFilters: boolean = false;
  protected standardOptions: Standard[] = [];
  protected standardValue = [];
  protected unitTypeOptions: { id: string; name: string }[] = [
    { id: 'WISE Platform', name: $localize`WISE Platform` },
    { id: 'Other Platform', name: $localize`Other Platform` }
  ];
  protected unitTypeValue = [];

  constructor(
    private libraryService: LibraryService,
    private utilService: UtilService
  ) {
    libraryService.officialLibraryProjectsSource$.subscribe((projects: LibraryProject[]) => {
      this.libraryProjects = projects;
      this.populateFilterOptions();
    });
    libraryService.communityLibraryProjectsSource$.subscribe((projects: LibraryProject[]) => {
      this.communityProjects = projects;
      this.populateFilterOptions();
    });
    libraryService.sharedLibraryProjectsSource$.subscribe((projects: LibraryProject[]) => {
      this.sharedProjects = projects;
      this.populateFilterOptions();
    });
    libraryService.personalLibraryProjectsSource$.subscribe((projects: LibraryProject[]) => {
      this.personalProjects = projects;
      this.populateFilterOptions();
    });
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
    this.libraryProjects
      .concat(this.communityProjects)
      .concat(this.sharedProjects)
      .concat(this.personalProjects)
      .forEach((project: LibraryProject) => this.populateFilterOptionsFromProject(project));
    this.removeDuplicatesAndSortAlphabetically();
  }

  private populateFilterOptionsFromProject(project: LibraryProject): void {
    project.metadata.disciplines?.forEach((discipline: any) =>
      this.disciplineOptions.push(new Discipline(discipline.id, discipline.name))
    );
    project.metadata.features?.forEach((feature: any) =>
      this.featureOptions.push(new Feature(feature.id, feature.name))
    );
    this.populateGradeLevels(project);
    this.populateStandards(project);
  }

  private populateGradeLevels(project: LibraryProject): void {
    project.metadata.grades
      ?.map((gradeLevel: string) => Number(gradeLevel))
      .filter((gradeLevel: number) => Object.values(Grade).includes(gradeLevel))
      .forEach((gradeLevel: number) => {
        this.gradeLevelOptions.push(new GradeLevel(gradeLevel));
      });
  }

  private populateStandards(project: LibraryProject): void {
    const standards = project.metadata.standards;
    [
      ['ngss', $localize`NGSS`],
      ['commonCore', $localize`Common Core`],
      ['learningForJustice', $localize`Learning For Justice`]
    ].forEach(([key, name]) => {
      (standards?.[key] ?? []).forEach((standard: any) =>
        this.standardOptions.push(
          new Standard(standard.id, standard.name, name as StandardType, standard.url)
        )
      );
    });
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
    this.featureOptions = this.utilService.removeObjectArrayDuplicatesByProperty(
      this.featureOptions,
      'id'
    );
    this.utilService.sortObjectArrayByProperty(this.featureOptions, 'name');
    this.gradeLevelOptions = this.utilService.removeObjectArrayDuplicatesByProperty(
      this.gradeLevelOptions,
      'grade'
    );
    this.gradeLevelOptions.sort((a, b) => a.grade - b.grade);
  }

  protected hasFilters(): boolean {
    return (
      this.standardValue.length > 0 ||
      this.disciplineValue.length > 0 ||
      this.gradeLevelValue.length > 0
    );
  }

  protected searchUpdated(value: string): void {
    this.searchValue = value.toLocaleLowerCase();
    this.emitFilterValues();
  }

  protected filterUpdated(value: string[], context: string = ''): void {
    switch (context) {
      case 'discipline':
        this.disciplineValue = value;
        break;
      case 'gradeLevel':
        this.gradeLevelValue = value;
        break;
      case 'standard':
        this.standardValue = value;
        break;
      case 'feature':
        this.featureValue = value;
        break;
      case 'unitType':
        this.unitTypeValue = value;
        break;
    }
    this.emitFilterValues();
  }

  private emitFilterValues(): void {
    const filterValues: ProjectFilterValues = new ProjectFilterValues();
    Object.assign(filterValues, {
      searchValue: this.searchValue,
      disciplineValue: this.disciplineValue,
      featureValue: this.featureValue,
      gradeLevelValue: this.gradeLevelValue,
      standardValue: this.standardValue,
      unitTypeValue: this.unitTypeValue
    });
    this.libraryService.setFilterValues(filterValues);
  }

  protected clearFilterValues(): void {
    this.standardValue = [];
    this.disciplineValue = [];
    this.gradeLevelValue = [];
    this.emitFilterValues();
  }
}
