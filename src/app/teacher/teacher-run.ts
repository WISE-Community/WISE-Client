import { Run } from '../domain/run';
import { SelectRunsOption } from './select-runs-controls/select-runs-option';

export class TeacherRun extends Run {
  archived: boolean;
  shared: boolean;
  highlighted: boolean;

  constructor(jsonObject: any = {}) {
    super(jsonObject);
  }

  updateSelected(selectRunsOption: SelectRunsOption, currentTime: number): void {
    switch (selectRunsOption) {
      case SelectRunsOption.All:
        this.project.selected = true;
        break;
      case SelectRunsOption.None:
        this.project.selected = false;
        break;
      case SelectRunsOption.Completed:
        this.project.selected = this.isCompleted(currentTime);
        break;
      case SelectRunsOption.Running:
        this.project.selected = this.isActive(currentTime);
        break;
      case SelectRunsOption.Scheduled:
        this.project.selected = this.isScheduled(currentTime);
        break;
    }
  }
}
