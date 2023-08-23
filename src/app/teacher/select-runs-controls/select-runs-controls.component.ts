import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';

@Component({
  selector: 'select-runs-controls',
  templateUrl: './select-runs-controls.component.html',
  styleUrls: ['./select-runs-controls.component.scss'],
  providers: [{ provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } }]
})
export class SelectRunsControlsComponent {
  @Input() numSelectedRuns: number = 0;
  @Input() numTotalRuns: number = 0;
  protected selectedAllRuns: boolean = false;
  protected selectedSomeRuns: boolean = false;
  @Output() selectRunsOptionChosenEvent = new EventEmitter<string>();

  ngOnChanges(): void {
    if (this.numSelectedRuns === 0) {
      this.selectedAllRuns = false;
      this.selectedSomeRuns = false;
    } else if (this.numSelectedRuns === this.numTotalRuns) {
      this.selectedAllRuns = true;
      this.selectedSomeRuns = false;
    } else {
      this.selectedAllRuns = false;
      this.selectedSomeRuns = true;
    }
  }

  protected selectAllRunsCheckboxClicked(): void {
    if (this.selectedAllRuns || this.selectedSomeRuns) {
      this.selectRunsOptionChosenEvent.emit('none');
    } else {
      this.selectRunsOptionChosenEvent.emit('all');
    }
  }

  protected selectRunsOptionChosen(value: string): void {
    this.selectRunsOptionChosenEvent.emit(value);
  }
}
