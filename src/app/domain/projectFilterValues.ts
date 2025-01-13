import { ResearchProjectTypes } from '../modules/library/standard';

export class ProjectFilterValues {
  searchValue: string = '';
  disciplineValue: string[] = [];
  dciArrangementValue: string[] = [];
  peValue: string[] = [];
  researchProjectValue: ResearchProjectTypes[] = [];
}
