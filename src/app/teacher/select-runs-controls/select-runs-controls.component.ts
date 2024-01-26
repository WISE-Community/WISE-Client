import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { TeacherRun } from '../teacher-run';
import { Project } from '../../domain/project';
import { SelectRunsOption } from './select-runs-option';

@Component({
  selector: 'select-runs-controls',
  templateUrl: './select-runs-controls.component.html',
  styleUrls: ['./select-runs-controls.component.scss'],
  providers: [{ provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } }]
})
export class SelectRunsControlsComponent {
  @Output() archiveActionEvent = new EventEmitter<void>();
  protected numSelectedRuns: number = 0;
  protected selectedProjects: Project[] = [];
  @Input() runChangedEventEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Input() runs: TeacherRun[] = [];
  protected selectedAllRuns: boolean = false;
  protected selectedSomeRuns: boolean = false;
  @Output() selectRunsOptionChosenEvent = new EventEmitter<SelectRunsOption>();
  @Input() showArchive: boolean = false;

  ngOnInit(): void {
    this.runChangedEventEmitter.subscribe(() => {
      this.ngOnChanges();
    });
  }

  ngOnChanges(): void {
    this.selectedProjects = this.runs
      .map((run: TeacherRun) => run.project)
      .filter((project: Project) => project.selected);
    this.numSelectedRuns = this.runs.filter((run: TeacherRun) => run.project.selected).length;
    this.selectedAllRuns = this.numSelectedRuns === this.runs.length;
    this.selectedSomeRuns = this.numSelectedRuns !== 0 && !this.selectedAllRuns;
  }

  protected selectAllRunsCheckboxClicked(): void {
    this.selectRunsOptionChosenEvent.emit(
      this.selectedAllRuns || this.selectedSomeRuns ? SelectRunsOption.None : SelectRunsOption.All
    );
  }

  protected selectRunsOptionChosen(value: string): void {
    this.selectRunsOptionChosenEvent.emit(value as SelectRunsOption);
  }
}
