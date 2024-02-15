import { Input, Signal, Output, computed, Directive } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { Language } from '../../../../../app/domain/language';
import { EditProjectTranslationService } from '../../../services/editProjectTranslationService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TranslateProjectService } from '../../../services/translateProjectService';
import { generateRandomKey } from '../../../common/string/string';

@Directive()
export abstract class AbstractTranslatableFieldComponent {
  @Input() content: object;
  protected currentLanguage: Signal<Language>;
  protected defaultLanguageText: Signal<string>;
  @Output() defaultLanguageTextChanged: Subject<string> = new Subject<string>();
  private i18nId: string;
  @Input() key: string;
  @Input() label: string;
  @Input() placeholder: string;
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
      .subscribe(async (text: string) => {
        if (this.i18nId == null) {
          await this.createI18NField();
        }
        this.saveTranslationText(text);
      });
  }

  ngOnDestroy(): void {
    this.translationTextChangedSubscription.unsubscribe();
  }

  private createI18NField(): Promise<any> {
    this.i18nId = generateRandomKey(30);
    this.content[`${this.key}.i18n`] = { id: this.i18nId, modified: new Date().getTime() };
    return this.projectService.saveProject();
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
