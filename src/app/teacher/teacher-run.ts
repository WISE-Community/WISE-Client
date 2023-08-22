import { Run } from '../domain/run';

export class TeacherRun extends Run {
  archived: boolean;
  selected: boolean;
  shared: boolean;
  highlighted: boolean;

  constructor(jsonObject: any = {}) {
    super(jsonObject);
  }
}
