import { Component, ContentChild, ElementRef, Input, Signal, computed } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { CommonModule } from '@angular/common';
import { MatInput, MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TranslateProjectService } from '../../../services/translateProjectService';
import { MatLabel } from '@angular/material/form-field';

@Component({
  standalone: true,
  selector: 'translatable-input',
  imports: [CommonModule, FormsModule, MatInputModule],
  styleUrls: ['./translatable-input.component.scss'],
  templateUrl: './translatable-input.component.html'
})
export class TranslatableInputComponent {
  @Input() content: object;
  @ContentChild(MatInput) defaultLanguageInput: MatInput;
  @ContentChild(MatLabel, { read: ElementRef }) defaultLanguageLabelRef: ElementRef;
  protected defaultLanguageTextHint: Signal<string>;
  @Input() key: string;
  protected showTranslationInput: Signal<boolean>;
  protected translatedText: Signal<string>;

  constructor(
    private projectService: TeacherProjectService,
    private translateProjectService: TranslateProjectService
  ) {
    this.showTranslationInput = computed(() => !this.projectService.isDefaultLocale());
  }

  ngOnInit(): void {
    const i18nId = this.content[`${this.key}.i18n`]?.id;
    this.translatedText = computed(() =>
      this.showTranslationInput()
        ? this.translateProjectService.currentTranslations()[i18nId]?.value
        : ''
    );
    this.defaultLanguageTextHint = computed(() =>
      this.showTranslationInput()
        ? $localize`(${this.projectService.getLocale().getDefaultLanguage().language}\: ${
            this.content[this.key]
          })`
        : ''
    );
  }

  protected saveTranslationText(text: string): void {
    // TODO: save translation text to server
  }
}
