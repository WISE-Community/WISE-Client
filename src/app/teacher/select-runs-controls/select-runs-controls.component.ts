import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxModule } from '@angular/material/checkbox';
import { TeacherRun } from '../teacher-run';
import { Project } from '../../domain/project';
import { SelectRunsOption } from './select-runs-option';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ArchiveProjectsButtonComponent } from '../archive-projects-button/archive-projects-button.component';

@Component({
  imports: [
    ArchiveProjectsButtonComponent,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule
  ],
  providers: [{ provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } }],
  selector: 'select-runs-controls',
  styleUrl: './select-runs-controls.component.scss',
  templateUrl: './select-runs-controls.component.html'
})
export class SelectRunsControlsComponent {
  @Output() archiveProjectsEvent = new EventEmitter<boolean>();
  protected numSelectedRuns: number = 0;
  @Input() runChangedEventEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Input() runs: TeacherRun[] = [];
  protected selectedAllRuns: boolean = false;
  protected selectedProjects: Project[] = [];
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
