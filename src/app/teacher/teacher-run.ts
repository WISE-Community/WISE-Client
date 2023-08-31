import { Run } from '../domain/run';
import { SelectRunsOption } from './select-runs-controls/select-runs-option';

export class TeacherRun extends Run {
  archived: boolean;
  selected: boolean;
  shared: boolean;
  highlighted: boolean;

  constructor(jsonObject: any = {}) {
    super(jsonObject);
  }

  updateSelected(selectRunsOption: SelectRunsOption, currentTime: number): void {
    switch (selectRunsOption) {
      case SelectRunsOption.All:
        this.selected = true;
        break;
      case SelectRunsOption.None:
        this.selected = false;
        break;
      case SelectRunsOption.Completed:
        this.selected = this.isCompleted(currentTime);
        break;
      case SelectRunsOption.Running:
        this.selected = this.isActive(currentTime);
        break;
      case SelectRunsOption.Scheduled:
        this.selected = this.isScheduled(currentTime);
        break;
    }
  }
}
