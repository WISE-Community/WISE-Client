import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';

interface TranslationSuggestionsDialogData {
  defaultLanguage: string;
  currentLanguage: string;
  defaultLanguageContent: string;
  currentLanguageContent?: string;
}

@Component({
  imports: [MatDividerModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule],
  selector: 'translation-suggestions-dialog',
  styles: [
    `
      .mat-divider {
        margin: 0;
      }
    `
  ],
  templateUrl: './translation-suggestions-dialog.component.html'
})
export class TranslationSuggestionsDialogComponent {
  readonly dialogRef = inject(MatDialogRef<TranslationSuggestionsDialogComponent>);
  readonly data = inject<TranslationSuggestionsDialogData>(MAT_DIALOG_DATA);
  protected translation;

  constructor(protected projectTranslationService: TeacherProjectTranslationService) {
    this.generateTranslationSuggestion();
  }

  private generateTranslationSuggestion(): void {
    this.projectTranslationService
      .getTranslationSuggestion(
        this.data.defaultLanguage,
        this.data.currentLanguage,
        this.data.defaultLanguageContent
      )
      .subscribe({
        next: (suggestedTranslation) => (this.translation = suggestedTranslation),
        error: () =>
          alert($localize`There was an error translating the text. Please talk to WISE staff.`)
      });
  }

  protected onClose(saveTranslation: boolean): void {
    this.dialogRef.close(saveTranslation && this.translation);
  }
}
