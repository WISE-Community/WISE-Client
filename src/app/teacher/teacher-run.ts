import { Run } from '../domain/run';

export class TeacherRun extends Run {
  isSelected: boolean;
  isHighlighted: boolean;
  shared: boolean;

  constructor(jsonObject: any = {}) {
    super(jsonObject);
  }
}
