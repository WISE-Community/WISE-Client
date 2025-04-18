import { LibraryProject } from '../modules/library/libraryProject';

export class ProjectFilterValues {
  disciplineValue: string[] = [];
  featureValue: string[] = [];
  gradeLevelValue: number[] = [];
  publicUnitType?: ('wiseTested' | 'communityBuilt')[] = [];
  publicUnitTypeValue?: ('wiseTested' | 'communityBuilt')[] = [];
  searchValue: string = '';
  standardValue: string[] = [];
  unitTypeValue: string[] = [];

  hasFilters(): boolean {
    return (
      this.standardValue.length +
        this.disciplineValue.length +
        this.unitTypeValue.length +
        this.gradeLevelValue.length +
        this.featureValue.length +
        (this.publicUnitTypeValue?.length ?? 0) >
      0
    );
  }

  matches(project: LibraryProject): boolean {
    return (
      this.matchesPublicUnitType(project) ||
      this.matchesStandard(project) ||
      this.matchesDiscipline(project) ||
      this.matchesUnitType(project) ||
      this.matchesFeature(project) ||
      this.matchesGradeLevel(project)
    );
  }

  private matchesUnitType(project: LibraryProject): boolean {
    const unitTypeValue =
      project.metadata.unitType === 'Platform' ? 'WISE Platform' : 'Other Platform';
    return this.unitTypeValue?.includes(unitTypeValue);
  }

  private matchesPublicUnitType(project: LibraryProject): boolean {
    return this.publicUnitTypeValue?.includes(project.metadata.publicUnitType);
  }

  private matchesStandard(project: LibraryProject): boolean {
    const standards = project.metadata.standards;
    const commonCore = standards?.commonCore ?? [];
    const ngss = standards?.ngss ?? [];
    const learningForJustice = standards?.learningForJustice ?? [];
    return [...commonCore, ...ngss, ...learningForJustice].some((val) =>
      this.standardValue.includes(val.id)
    );
  }

  private matchesFeature(project: LibraryProject): boolean {
    return (
      this.featureValue.length > 0 &&
      project.metadata.features?.some((feature) => this.featureValue.includes(feature.id))
    );
  }

  private matchesDiscipline(project: LibraryProject): boolean {
    return (
      this.disciplineValue.length > 0 &&
      project.metadata.disciplines?.some((discipline) =>
        this.disciplineValue.includes(discipline.id)
      )
    );
  }

  private matchesGradeLevel(project: LibraryProject): boolean {
    return (
      this.gradeLevelValue.length > 0 &&
      project.metadata.grades?.some((gradeLevel) =>
        this.gradeLevelValue.includes(Number(gradeLevel))
      )
    );
  }
}
