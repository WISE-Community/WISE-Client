import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { TeacherRun } from '../teacher-run';
import { ArchiveProjectResponse } from '../../domain/archiveProjectResponse';
import { Subscription } from 'rxjs';
import { Project } from '../../domain/project';
import { ArchiveProjectService } from '../../services/archive-project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  @Input() runChangedEventEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Input() runs: TeacherRun[] = [];
  protected selectedAllRuns: boolean = false;
  protected selectedSomeRuns: boolean = false;
  @Output() selectRunsOptionChosenEvent = new EventEmitter<SelectRunsOption>();
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
    this.numSelectedRuns = this.runs.filter((run: TeacherRun) => run.selected).length;
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

  protected archiveSelectedRuns(archive: boolean): Subscription {
    const runs = this.getSelectedRuns();
    return this.archiveProjectService[archive ? 'archiveProjects' : 'unarchiveProjects'](
      this.getProjects(runs)
    ).subscribe({
      next: (archiveProjectsResponse: ArchiveProjectResponse[]) => {
        this.updateRunsArchivedStatus(runs, archiveProjectsResponse);
        this.openSuccessSnackBar(runs, archiveProjectsResponse, archive);
      },
      error: () => {
        this.showErrorSnackBar(archive);
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

  private openSuccessSnackBar(
    runs: TeacherRun[],
    archiveProjectsResponse: ArchiveProjectResponse[],
    archived: boolean
  ): void {
    const count = archiveProjectsResponse.filter(
      (response: ArchiveProjectResponse) => response.archived === archived
    ).length;
    this.snackBar
      .open(
        archived
          ? $localize`Successfully archived ${count} unit(s).`
          : $localize`Successfully restored ${count} unit(s).`,
        $localize`Undo`
      )
      .onAction()
      .subscribe(() => {
        this.undoArchiveAction(runs, archived ? 'unarchiveProjects' : 'archiveProjects');
      });
  }

  private showErrorSnackBar(archive: boolean): void {
    this.snackBar.open(
      archive ? $localize`Error archiving unit(s).` : $localize`Error restoring unit(s).`
    );
  }

  private undoArchiveAction(runs: TeacherRun[], archiveFunctionName: string): void {
    this.archiveProjectService[archiveFunctionName](this.getProjects(runs)).subscribe({
      next: (archiveProjectsResponse: ArchiveProjectResponse[]) => {
        this.updateRunsArchivedStatus(runs, archiveProjectsResponse);
        this.archiveProjectService.refreshProjects();
        this.snackBar.open($localize`Action undone.`);
      },
      error: () => {
        this.snackBar.open($localize`Error undoing action.`);
      }
    });
  }

  private getSelectedRuns(): TeacherRun[] {
    return this.runs.filter((run: TeacherRun) => run.selected);
  }

  private getProjects(runs: TeacherRun[]): Project[] {
    return runs.map((run: TeacherRun) => run.project);
  }
}
