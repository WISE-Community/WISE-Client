import { Component, Input, SimpleChanges } from '@angular/core';
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
export class LibraryFiltersComponent {
  private communityProjects: LibraryProject[] = [];
  protected disciplineOptions: Discipline[] = [];
  protected featureOptions: Feature[] = [];
  protected filterValues: ProjectFilterValues = new ProjectFilterValues();
  protected gradeLevelOptions: GradeLevel[] = [];
  @Input() showAdvancedFilteringOptions: boolean = true;
  @Input() isSplitScreen: boolean = false;
  private libraryProjects: LibraryProject[] = [];
  private personalProjects: LibraryProject[] = [];
  protected possibleStandardLabels = ['NGSS', 'Common Core', 'Learning For Justice'];
  private sharedProjects: LibraryProject[] = [];
  protected showFilters: boolean = false;
  protected standardOptions: Standard[] = [];
  protected unitTypeOptions: { id: string; name: string }[] = [
    { id: 'WISE Platform', name: $localize`WISE Platform` },
    { id: 'Other Platform', name: $localize`Other Platform` }
  ];

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
      this.filterValues.standardValue.length > 0 ||
      this.filterValues.disciplineValue.length > 0 ||
      this.filterValues.gradeLevelValue.length > 0
    );
  }

  protected searchUpdated(value: string): void {
    this.filterValues.searchValue = value.toLocaleLowerCase();
    this.emitFilterValues();
  }

  protected filterUpdated(value: any[], context: string = ''): void {
    switch (context) {
      case 'discipline':
        this.filterValues.disciplineValue = value;
        break;
      case 'gradeLevel':
        this.filterValues.gradeLevelValue = value;
        break;
      case 'standard':
        this.filterValues.standardValue = value;
        break;
      case 'feature':
        this.filterValues.featureValue = value;
        break;
      case 'unitType':
        this.filterValues.unitTypeValue = value;
        break;
    }
    this.emitFilterValues();
  }

  private emitFilterValues(): void {
    this.libraryService.setFilterValues(this.filterValues);
  }

  protected clearFilterValues(): void {
    this.filterValues.standardValue = [];
    this.filterValues.disciplineValue = [];
    this.filterValues.gradeLevelValue = [];
    this.emitFilterValues();
  }
}
