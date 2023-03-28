import { NodeProgress } from './NodeProgress';

export class StudentStatus {
  computerAvatarId?: string;
  currentNodeId: string;
  nodeStatuses: any;
  periodId: number;
  projectCompletion: NodeProgress;
  runId: number;
  workgroupId: number;

  constructor(jsonObject: any = {}) {
    for (const key of Object.keys(jsonObject)) {
      if (jsonObject[key] != null) {
        this[key] = jsonObject[key];
      }
    }
  }
}
