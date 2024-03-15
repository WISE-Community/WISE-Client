import { Input, Signal, Output, computed, Directive } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { Language } from '../../../../../app/domain/language';
import { EditProjectTranslationService } from '../../../services/editProjectTranslationService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TranslateProjectService } from '../../../services/translateProjectService';
import { generateRandomKey } from '../../../common/string/string';
import { toObservable } from '@angular/core/rxjs-interop';
import { Translations } from '../../../../../app/domain/translations';

@Directive()
export abstract class AbstractTranslatableFieldComponent {
  @Input() content: object;
  protected currentLanguage: Signal<Language>;
  private currentTranslations$ = toObservable(this.translateProjectService.currentTranslations);
  protected defaultLanguage: Language = this.projectService.getLocale().getDefaultLanguage();
  protected defaultLanguageText: Signal<string>;
  @Output() defaultLanguageTextChanged: Subject<string> = new Subject<string>();
  protected i18nId: string;
  @Input() key: string;
  @Input() label: string;
  @Input() placeholder: string;
  protected showTranslationInput: Signal<boolean>;
  protected subscriptions: Subscription = new Subscription();
  protected translationText: string;
  protected translationTextChanged: Subject<string> = new Subject<string>();
  constructor(
    protected editProjectTranslationService: EditProjectTranslationService,
    protected projectService: TeacherProjectService,
    protected translateProjectService: TranslateProjectService
  ) {
    this.currentLanguage = projectService.currentLanguage;
    this.showTranslationInput = computed(() => !this.projectService.isDefaultLocale());
  }

  ngOnInit(): void {
    this.i18nId = this.content[`${this.key}.i18n`]?.id;
    this.defaultLanguageText = computed(() => this.content[this.key]);
    this.subscriptions.add(
      this.currentTranslations$.subscribe((translations: Translations) => {
        this.setTranslationText(translations[this.i18nId]?.value);
      })
    );
    this.subscriptions.add(
      this.translationTextChanged
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe(async (text: string) => {
          if (this.i18nId == null) {
            await this.createI18NField();
          }
          this.saveTranslationText(text);
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected setTranslationText(text: string): void {
    this.translationText = text;
  }

  private createI18NField(): Promise<any> {
    this.i18nId = generateRandomKey(30);
    this.content[`${this.key}.i18n`] = { id: this.i18nId, modified: new Date().getTime() };
    return this.projectService.saveProject();
  }

  protected saveTranslationText(text: string): void {
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
