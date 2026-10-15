import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TeacherPresentationSelectionStore } from './teacher-presentation-selection.store';
import { StudentNamesDisplayMode } from './teacher-presentation-config';
import { DiscussionTeacherComponent } from '../components/discussion/discussion-teacher/discussion-teacher.component';

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
    MatSelectModule,
    MatTooltipModule,
    DiscussionTeacherComponent
  ],
  styleUrl: './teacher-presentation-dialog.component.scss',
  templateUrl: './teacher-presentation-dialog.component.html'
})
export class TeacherPresentationDialogComponent implements OnInit {
  @ViewChild('promptInput', { read: NgModel }) protected promptInput?: NgModel;

  protected editedPrompt = '';
  protected hideControls = false;
  protected isEditingPrompt = false;
  protected store: TeacherPresentationSelectionStore;

  public dialogRef = inject(MatDialogRef<TeacherPresentationDialogComponent>);
  public data: TeacherPresentationDialogData = inject(MAT_DIALOG_DATA);

  constructor() {
    this.store = this.data.store;
  }

  ngOnInit(): void {
    this.editedPrompt = this.effectivePrompt;
  }

  get defaultPrompt(): string {
    return (
      this.data.component?.content?.teacher?.presentation?.prompt ||
      this.data.component?.content?.presentation?.prompt ||
      $localize`Here are some of your classmates' posts. Pick one to discuss with your partner.`
    );
  }

  get effectivePrompt(): string {
    const custom = this.store.prompt();
    return custom != null ? custom : this.defaultPrompt;
  }

  get isSavedPromptDifferentFromDefault(): boolean {
    return (this.effectivePrompt?.trim() ?? '') !== (this.defaultPrompt?.trim() ?? '');
  }

  get isPromptDirty(): boolean {
    return this.promptInput ? !!this.promptInput.dirty : this.editedPrompt !== this.effectivePrompt;
  }

  get isAnonymize(): boolean {
    return this.store.studentNamesDisplay() === 'anonymize';
  }

  onNamesDisplayChange(mode: StudentNamesDisplayMode): void {
    if (mode) {
      this.store.setStudentNamesDisplay(mode);
    }
  }

  toggleControls(checked?: boolean): void {
    this.hideControls = checked !== undefined ? !checked : !this.hideControls;
    if (this.hideControls) {
      this.isEditingPrompt = false;
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

  close(): void {
    this.dialogRef.close();
  }
}
