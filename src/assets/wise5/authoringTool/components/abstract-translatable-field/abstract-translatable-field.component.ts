import { Input, Signal, Output, computed, Directive } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { Language } from '../../../../../app/domain/language';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { generateRandomKey } from '../../../common/string/string';
import { toObservable } from '@angular/core/rxjs-interop';
import { Translations } from '../../../../../app/domain/translations';
import { copy } from '../../../common/object/object';

@Directive()
export abstract class AbstractTranslatableFieldComponent {
  @Input() content: object;
  protected currentLanguage: Signal<Language> = this.projectService.currentLanguage;
  private currentTranslations$ = toObservable(this.projectTranslationService.currentTranslations);
  protected defaultLanguage: Language = this.projectService.getLocale().getDefaultLanguage();
  @Output() defaultLanguageTextChanged: Subject<string> = new Subject<string>();
  @Input() hint: string;
  protected i18nId: string;
  @Input() key: string;
  @Input() label: string;
  @Input() placeholder: string;
  protected showTranslationInput: Signal<boolean> = computed(
    () => !this.projectService.isDefaultLocale()
  );
  protected subscriptions: Subscription = new Subscription();
  protected translationText: string;
  protected translationTextChanged: Subject<string> = new Subject<string>();
  constructor(
    protected projectService: TeacherProjectService,
    protected projectTranslationService: TeacherProjectTranslationService
  ) {}

  ngOnChanges(): void {
    this.setI18nId();
    this.subscriptions.add(
      this.currentTranslations$.subscribe((translations: Translations) => {
        // i18nId might have been created by another component (e.g. this=input, other=AssetChooser)
        this.setI18nId();
        if (this.showTranslationInput()) {
          this.setTranslationText(translations[this.i18nId]?.value);
        }
      })
    );
    this.subscriptions.add(
      this.translationTextChanged.pipe(debounceTime(1000)).subscribe(async (text: string) => {
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

  private setI18nId(): void {
    this.i18nId = this.content[`${this.key}.i18n`]?.id;
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
    const currentTranslations = copy(this.projectTranslationService.currentTranslations());
    currentTranslations[this.i18nId] = { value: text, modified: new Date().getTime() };
    this.projectTranslationService.saveCurrentTranslations(currentTranslations).subscribe();
  }
}
