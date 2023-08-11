import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';

@Component({
  selector: 'select-runs-controls',
  templateUrl: './select-runs-controls.component.html',
  styleUrls: ['./select-runs-controls.component.scss'],
  providers: [{ provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } }]
})
export class SelectRunsControlsComponent {
  isSelectedAllRuns: boolean = false;
  isSelectedSomeRuns: boolean = false;
  @Input() numSelectedRuns: number = 0;
  @Input() numTotalRuns: number = 0;
  @Output() selectRunsOptionChosenEvent = new EventEmitter<string>();

  ngOnChanges(): void {
    if (this.numSelectedRuns === 0) {
      this.isSelectedAllRuns = false;
      this.isSelectedSomeRuns = false;
    } else if (this.numSelectedRuns === this.numTotalRuns) {
      this.isSelectedAllRuns = true;
      this.isSelectedSomeRuns = false;
    } else {
      this.isSelectedAllRuns = false;
      this.isSelectedSomeRuns = true;
    }
  }

  protected selectAllRunsCheckboxClicked(): void {
    if (this.isSelectedAllRuns || this.isSelectedSomeRuns) {
      this.selectRunsOptionChosenEvent.emit('none');
    } else {
      this.selectRunsOptionChosenEvent.emit('all');
    }
  }

  protected selectRunsOptionChosen(value: string): void {
    this.selectRunsOptionChosenEvent.emit(value);
  }
}
