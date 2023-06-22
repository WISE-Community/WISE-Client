import { Run } from '../domain/run';

export class TeacherRun extends Run {
  isArchived: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  shared: boolean;

  constructor(jsonObject: any = {}) {
    super(jsonObject);
  }
}
