import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TeacherPresentationSelectionStore } from './teacher-presentation-selection.store';
import { StudentNamesDisplayMode } from './teacher-presentation-config';
import { DiscussionTeacherComponent } from '../components/discussion/discussion-teacher/discussion-teacher.component';
import { ConfigService } from '../services/configService';

export interface TeacherPresentationDialogData {
  nodeId: string;
  component: any;
  periodId: number;
  periodName?: string;
  store: TeacherPresentationSelectionStore;
}

@Component({
  selector: 'teacher-presentation-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatTooltipModule,
    DiscussionTeacherComponent
  ],
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      width: 100vw;
      height: 100vh;
      max-width: 100vw !important;
      max-height: 100vh !important;
      background: var(--mat-dialog-container-background-color, #ffffff);
    }

    .presentation-header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      background-color: var(--mat-sys-surface, #f8f9fa);
    }

    .presentation-body {
      flex: 1 1 auto;
      overflow-y: auto;
      padding: 1.5rem;
    }

    .prompt-text {
      font-size: 1.75rem;
      line-height: 2.25rem;
      font-weight: 500;
      color: var(--mat-sys-on-surface, #1f2937);
    }
  `,
  template: `
    <div class="presentation-header flex flex-col gap-3">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="mat-headline-6 font-semibold" i18n>Classroom Presentation</span>
          @if (data.periodName) {
            <span class="text-sm px-2 py-0.5 rounded bg-gray-200 text-gray-700">
              {{ data.periodName }}
            </span>
          }
        </div>
        <div class="flex items-center gap-2">
          @if (!hideControls) {
            <mat-button-toggle-group
              [ngModel]="store.studentNamesDisplay()"
              (ngModelChange)="onNamesDisplayChange($event)"
              aria-label="Student Names Display"
            >
              <mat-button-toggle value="hide" i18n>Hide Names</mat-button-toggle>
              <mat-button-toggle value="anonymize" i18n>Anonymize</mat-button-toggle>
              <mat-button-toggle value="show" i18n>Show Names</mat-button-toggle>
            </mat-button-toggle-group>

            <button mat-icon-button (click)="refresh()" matTooltip="Refresh" i18n-matTooltip>
              <mat-icon>refresh</mat-icon>
            </button>
          }

          <button
            mat-stroked-button
            (click)="hideControls = !hideControls"
            matTooltip="Toggle presentation controls"
            i18n
          >
            {{ hideControls ? 'Show Controls' : 'Hide Controls' }}
          </button>

          <button mat-icon-button (click)="close()" matTooltip="Close (Esc)" i18n-matTooltip>
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <!-- Presentation Prompt Area -->
      <div class="flex items-start gap-2 pt-1">
        @if (!isEditingPrompt) {
          <div class="prompt-text flex-grow">
            {{ effectivePrompt }}
          </div>
          @if (!hideControls) {
            <button
              mat-icon-button
              (click)="startEditPrompt()"
              aria-label="Edit prompt"
              matTooltip="Edit prompt"
              i18n-matTooltip
            >
              <mat-icon>edit</mat-icon>
            </button>
          }
        } @else {
          <div class="flex flex-col gap-2 w-full max-w-3xl">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label i18n>Presentation Prompt</mat-label>
              <textarea
                matInput
                [(ngModel)]="editedPrompt"
                rows="3"
                maxlength="1000"
              ></textarea>
            </mat-form-field>
            <div class="flex items-center gap-2">
              <button mat-flat-button color="primary" (click)="savePrompt()" i18n>Save</button>
              <button mat-button (click)="cancelEditPrompt()" i18n>Cancel</button>
              @if (store.prompt() != null) {
                <button mat-button color="warn" (click)="resetPromptToDefault()" i18n>
                  Reset to default
                </button>
              }
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Presentation Body -->
    <div class="presentation-body">
      @if (store.selectedCount() === 0) {
        <div class="flex flex-col items-center justify-center p-12 text-center text-gray-500">
          <mat-icon class="mat-48 mb-2">visibility_off</mat-icon>
          <div class="mat-body-1" i18n>No posts selected. Close and check posts to display.</div>
        </div>
      } @else {
        <discussion-teacher
          #discussionTeacher
          [nodeId]="data.nodeId"
          [component]="data.component"
          [periodId]="data.periodId"
          [anonymizeResponses]="isAnonymize"
          [studentNamesDisplayMode]="store.studentNamesDisplay()"
          [presentationSelectedIds]="store.selectedIds()"
          [presentationStore]="store"
          [mode]="'presentation'"
        />
      }
    </div>
  `
})
export class TeacherPresentationDialogComponent implements OnInit {
  protected store: TeacherPresentationSelectionStore;
  protected hideControls = false;
  protected isEditingPrompt = false;
  protected editedPrompt = '';

  public dialogRef = inject(MatDialogRef<TeacherPresentationDialogComponent>);
  public data: TeacherPresentationDialogData = inject(MAT_DIALOG_DATA);
  private configService = inject(ConfigService);

  constructor() {
    this.store = this.data.store;
  }

  ngOnInit(): void {
    this.editedPrompt = this.effectivePrompt;
  }

  get defaultPrompt(): string {
    return (
      this.data.component?.content?.presentation?.prompt ||
      $localize`Here are your classmates' posts and comments. Which posts do you agree with?`
    );
  }

  get effectivePrompt(): string {
    const custom = this.store.prompt();
    return custom != null && custom.trim() !== '' ? custom : this.defaultPrompt;
  }

  get isAnonymize(): boolean {
    return this.store.studentNamesDisplay() === 'anonymize';
  }

  onNamesDisplayChange(mode: StudentNamesDisplayMode): void {
    if (mode) {
      this.store.setStudentNamesDisplay(mode);
    }
  }

  startEditPrompt(): void {
    this.editedPrompt = this.effectivePrompt;
    this.isEditingPrompt = true;
  }

  savePrompt(): void {
    this.store.setPrompt(this.editedPrompt.trim());
    this.isEditingPrompt = false;
  }

  cancelEditPrompt(): void {
    this.isEditingPrompt = false;
  }

  resetPromptToDefault(): void {
    this.store.setPrompt(null);
    this.editedPrompt = this.defaultPrompt;
    this.isEditingPrompt = false;
  }

  refresh(): void {
    const runId = this.configService.getRunId();
    if (runId && this.data.periodId) {
      this.store.init(
        runId,
        this.data.periodId,
        this.data.nodeId,
        this.data.component.id,
        this.data.component.type,
        this.data.component.content?.presentation?.reflectionQuestions || []
      );
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
