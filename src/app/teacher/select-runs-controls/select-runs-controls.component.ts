import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { TeacherRun } from '../teacher-run';
import { ArchiveProjectResponse } from '../../domain/archiveProjectResponse';
import { Subscription } from 'rxjs';
import { Project } from '../../domain/project';
import { ArchiveProjectService } from '../../services/archive-project.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'select-runs-controls',
  templateUrl: './select-runs-controls.component.html',
  styleUrls: ['./select-runs-controls.component.scss'],
  providers: [{ provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } }]
})
export class SelectRunsControlsComponent {
  @Output() archiveActionEvent = new EventEmitter<void>();
  protected numSelectedRuns: number = 0;
  @Input() runChangedEventEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Input() runs: TeacherRun[] = [];
  protected selectedAllRuns: boolean = false;
  protected selectedSomeRuns: boolean = false;
  @Output() selectRunsOptionChosenEvent = new EventEmitter<string>();
  @Input() showArchived: boolean = false;

  constructor(
    private archiveProjectService: ArchiveProjectService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.runChangedEventEmitter.subscribe(() => {
      this.ngOnChanges();
    });
  }

  ngOnChanges(): void {
    const numRuns = this.runs.length;
    this.numSelectedRuns = this.runs.filter((run: TeacherRun) => run.selected).length;
    if (this.numSelectedRuns === 0) {
      this.selectedAllRuns = false;
      this.selectedSomeRuns = false;
    } else if (this.numSelectedRuns === numRuns) {
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

  protected archiveSelectedRuns(): Subscription {
    const runs = this.getSelectedRuns();
    return this.archiveProjectService.archiveProjects(this.getProjects(runs)).subscribe({
      next: (archiveProjectsResponse: ArchiveProjectResponse[]) => {
        this.updateRunsArchivedStatus(runs, archiveProjectsResponse);
        this.snackBar.open(
          $localize`Successfully archived ${
            archiveProjectsResponse.filter((response: ArchiveProjectResponse) => response.archived)
              .length
          } unit(s).`
        );
      },
      error: () => {
        this.snackBar.open($localize`Error archiving unit(s).`);
      }
    });
  }

  protected restoreSelectedRuns(): Subscription {
    const runs = this.getSelectedRuns();
    return this.archiveProjectService.unarchiveProjects(this.getProjects(runs)).subscribe({
      next: (archiveProjectsResponse: ArchiveProjectResponse[]) => {
        this.updateRunsArchivedStatus(runs, archiveProjectsResponse);
        this.snackBar.open(
          $localize`Successfully restored ${
            archiveProjectsResponse.filter((response: ArchiveProjectResponse) => !response.archived)
              .length
          } unit(s).`
        );
      },
      error: () => {
        this.snackBar.open($localize`Error restoring unit(s).`);
      }
    });
  }

  private updateRunsArchivedStatus(
    runs: TeacherRun[],
    archiveProjectsResponse: ArchiveProjectResponse[]
  ): void {
    for (const archiveProjectResponse of archiveProjectsResponse) {
      const run = runs.find((run: TeacherRun) => run.project.id === archiveProjectResponse.id);
      run.archived = archiveProjectResponse.archived;
    }
    this.archiveActionEvent.emit();
  }

  private getSelectedRuns(): TeacherRun[] {
    return this.runs.filter((run: TeacherRun) => {
      return run.selected;
    });
  }

  private getProjects(runs: TeacherRun[]): Project[] {
    return runs.map((run: TeacherRun) => run.project);
  }
}
