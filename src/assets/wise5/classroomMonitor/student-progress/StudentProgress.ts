import { ProjectCompletion } from '../../common/ProjectCompletion';

export class StudentProgress {
  currentNodeId: string;
  periodId: string;
  periodName: string;
  workgroupId: number;
  username: string;
  firstName: string;
  lastName: string;
  nodePosition: string;
  positionAndTitle: string;
  order: number;
  completion: ProjectCompletion;
  completionPct: number;
  score: number;
  maxScore: number;
  scorePct: number;

  constructor(jsonObject: any = {}) {
    for (const key of Object.keys(jsonObject)) {
      this[key] = jsonObject[key];
    }
  }
}
