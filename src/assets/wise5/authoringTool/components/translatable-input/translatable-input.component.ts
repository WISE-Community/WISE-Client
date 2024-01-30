import { Component, ContentChild, ElementRef, Input, Signal, computed } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { EditProjectTranslationService } from '../../../services/editProjectTranslationService';
import { CommonModule } from '@angular/common';
import { MatInput, MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TranslateProjectService } from '../../../services/translateProjectService';
import { MatLabel } from '@angular/material/form-field';
import { Language } from '../../../../../app/domain/language';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  standalone: true,
  selector: 'translatable-input',
  imports: [CommonModule, FormsModule, MatInputModule],
  providers: [EditProjectTranslationService],
  styleUrls: ['./translatable-input.component.scss'],
  templateUrl: './translatable-input.component.html'
})
export class TranslatableInputComponent {
  @Input() content: object;
  protected currentLanguage: Signal<Language>;
  @ContentChild(MatInput) defaultLanguageInput: MatInput;
  @ContentChild(MatLabel, { read: ElementRef }) defaultLanguageLabelRef: ElementRef;
  protected defaultLanguageText: Signal<string>;
  private i18nId: string;
  @Input() key: string;
  protected showTranslationInput: Signal<boolean>;
  protected translationText: Signal<string>;
  protected translationTextChanged: Subject<string> = new Subject<string>();
  protected translationTextChangedSubscription: Subscription;

  constructor(
    private editProjectTranslationService: EditProjectTranslationService,
    private projectService: TeacherProjectService,
    private translateProjectService: TranslateProjectService
  ) {
    this.currentLanguage = projectService.currentLanguage;
    this.showTranslationInput = computed(() => !this.projectService.isDefaultLocale());
  }

  ngOnInit(): void {
    this.i18nId = this.content[`${this.key}.i18n`]?.id;
    this.translationText = computed(() =>
      this.showTranslationInput()
        ? this.translateProjectService.currentTranslations()[this.i18nId]?.value
        : ''
    );
    this.defaultLanguageText = computed(() =>
      this.showTranslationInput()
        ? `[${this.projectService.getLocale().getDefaultLanguage().language}\] ${
            this.content[this.key]
          }`
        : ''
    );
    this.translationTextChangedSubscription = this.translationTextChanged
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((text: string) => {
        this.saveTranslationText(text);
      });
  }

  ngOnDestory(): void {
    this.translationTextChangedSubscription.unsubscribe();
  }

  private saveTranslationText(text: string): void {
    this.projectService.broadcastSavingProject();
    const currentTranslations = this.translateProjectService.currentTranslations();
    currentTranslations[this.i18nId] = { value: text, modified: new Date().getTime() };
    this.editProjectTranslationService
      .saveCurrentTranslations(currentTranslations)
      .subscribe(() => {
        this.projectService.broadcastProjectSaved();
      });
  }
}
