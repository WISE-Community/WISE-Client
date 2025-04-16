import { ResearchProjectType } from '../modules/library/ResearchProject';

export class ProjectFilterValues {
  disciplineValue: string[] = [];
  publicUnitType?: ('wiseTested' | 'communityBuilt')[] = [];
  researchProjectValue: ResearchProjectType[] = [];
  searchValue: string = '';
  standardValue: string[] = [];
}
