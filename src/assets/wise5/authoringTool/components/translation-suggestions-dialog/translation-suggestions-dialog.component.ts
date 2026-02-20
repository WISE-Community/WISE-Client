import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Language } from '../../../../../app/domain/language';
import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';

interface TranslationSuggestionsDialogData {
  defaultLanguage: Language;
  currentLanguage: Language;
  defaultLanguageContent: string;
  currentLanguageContent?: string;
}

@Component({
  selector: 'translation-suggestions-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './translation-suggestions-dialog.component.html',
  styleUrl: './translation-suggestions-dialog.component.scss'
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
        this.data.defaultLanguage.language,
        this.data.currentLanguage.language,
        this.data.defaultLanguageContent
      )
      .subscribe((suggestedTranslation: string) => {
        this.translation = suggestedTranslation;
      });
  }

  protected onClose(saveTranslation: boolean): void {
    this.dialogRef.close(saveTranslation && this.translation);
  }
}
