import { Subject } from 'rxjs';
import { LibraryProject } from '../modules/library/libraryProject';
import { Location } from '../modules/library/Location';

export class ProjectFilterValues {
  disciplineValue: string[] = [];
  featureValue: string[] = [];
  gradeLevelValue: number[] = [];
  locationValue: string[] = [];
  publicUnitType?: ('wiseTested' | 'communityBuilt')[] = [];
  publicUnitTypeValue?: ('wiseTested' | 'communityBuilt')[] = [];
  searchValue: string = '';
  standardValue: string[] = [];
  unitTypeValue: string[] = [];
  private updatedSource = new Subject<void>();
  public updated$ = this.updatedSource.asObservable();

  matches(project: LibraryProject): boolean {
    return (
      this.matchesSearch(project) &&
      this.matchesPublicUnitType(project) &&
      this.matchesStandard(project) &&
      this.matchesDiscipline(project) &&
      this.matchesUnitType(project) &&
      this.matchesFeature(project) &&
      this.matchesGradeLevel(project) &&
      this.matchesLocation(project)
    );
  }

  private matchesSearch(project: LibraryProject): boolean {
    project.metadata.id = project.id;
    return (
      !this.searchValue ||
      Object.keys(project.metadata)
        .filter((prop) =>
          // only check for match in specific metadata fields
          ['title', 'summary', 'keywords', 'features', 'standards', 'id'].includes(prop)
        )
        .some((prop) => {
          let value = project.metadata[prop];
          if (prop === 'standards') {
            value = JSON.stringify(value);
          }
          return (
            typeof value !== 'undefined' &&
            value != null &&
            value.toString().toLocaleLowerCase().indexOf(this.searchValue) !== -1
          );
        })
    );
  }

  hasFilters(): boolean {
    return (
      this.standardValue.length +
        this.disciplineValue.length +
        this.unitTypeValue.length +
        this.gradeLevelValue.length +
        this.featureValue.length +
        this.locationValue.length >
      0
    );
  }

  clear(): void {
    this.disciplineValue = [];
    this.featureValue = [];
    this.gradeLevelValue = [];
    this.publicUnitTypeValue = [];
    this.searchValue = '';
    this.standardValue = [];
    this.unitTypeValue = [];
    this.locationValue = [];
  }

  private matchesUnitType(project: LibraryProject): boolean {
    const unitTypeValue =
      project.metadata.unitType === 'Platform' ? 'WISE Platform' : 'Other Platform';
    return this.unitTypeValue.length === 0 || this.unitTypeValue?.includes(unitTypeValue);
  }

  private matchesPublicUnitType(project: LibraryProject): boolean {
    return (
      this.publicUnitTypeValue?.length === 0 ||
      this.publicUnitTypeValue?.includes(project.metadata.publicUnitType)
    );
  }

  private matchesStandard(project: LibraryProject): boolean {
    const standards = project.metadata.standards;
    const commonCore = standards?.commonCore ?? [];
    const ngss = standards?.ngss ?? [];
    const learningForJustice = standards?.learningForJustice ?? [];
    return (
      this.standardValue.length === 0 ||
      [...commonCore, ...ngss, ...learningForJustice].some((val) =>
        this.standardValue.includes(val.id)
      )
    );
  }

  private matchesLocation(project: LibraryProject): boolean {
    return (
      this.locationValue.length === 0 ||
      project.metadata.locations
        ?.map((location) => Object.assign(new Location(), location))
        .flatMap((location) => location.getLocationOptions())
        .some((locationOption) => this.locationValue.includes(locationOption.name))
    );
  }

  private matchesFeature(project: LibraryProject): boolean {
    return (
      this.featureValue.length === 0 ||
      project.metadata.features?.some((feature) => this.featureValue.includes(feature.name))
    );
  }

  private matchesDiscipline(project: LibraryProject): boolean {
    return (
      this.disciplineValue.length === 0 ||
      project.metadata.disciplines?.some((discipline) =>
        this.disciplineValue.includes(discipline.id)
      )
    );
  }

  private matchesGradeLevel(project: LibraryProject): boolean {
    return (
      this.gradeLevelValue.length === 0 ||
      project.metadata.grades?.some((gradeLevel) =>
        this.gradeLevelValue.includes(Number(gradeLevel))
      )
    );
  }

  emitUpdated(): void {
    this.updatedSource.next();
  }
}
