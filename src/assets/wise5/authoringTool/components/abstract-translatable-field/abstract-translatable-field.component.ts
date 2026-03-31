import { ConfigService } from '../../../services/configService';
import { copy } from '../../../common/object/object';
import { generateRandomKey } from '../../../common/string/string';
import { Input, Signal, Output, computed, Directive } from '@angular/core';
import { Language } from '../../../../../app/domain/language';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { toObservable } from '@angular/core/rxjs-interop';
import { Translations } from '../../../../../app/domain/translations';
import { TranslationSuggestionsDialogComponent } from '../translation-suggestions-dialog/translation-suggestions-dialog.component';

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
    protected configService: ConfigService,
    protected dialog: MatDialog,
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
    if (this.i18nId === undefined) {
      this.createI18NField();
    }
    const currentTranslations = copy(this.projectTranslationService.currentTranslations());
    currentTranslations[this.i18nId] = { value: text, modified: new Date().getTime() };
    this.projectTranslationService.saveCurrentTranslations(currentTranslations).subscribe();
  }

  protected isTranslationServiceEnabled(): boolean {
    return this.configService.getConfigParam('translationServiceEnabled');
  }

  protected async translateText(event: Event): Promise<void> {
    event.preventDefault();
    if (this.translationText) {
      this.openDialog();
    } else {
      this.projectTranslationService
        .getTranslationSuggestion(
          this.defaultLanguage.language,
          this.currentLanguage().language,
          this.content[this.key]
        )
        .subscribe({
          next: (translation) => this.saveTranslationText(translation),
          error: () =>
            alert(
              $localize`There was an error translating the text. Please contact WISE staff if the error persists.`
            )
        });
    }
  }

  private openDialog(): void {
    const dialogRef = this.createDialogRef();
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        this.saveTranslationText(result);
      }
    });
  }

  private createDialogRef(): MatDialogRef<TranslationSuggestionsDialogComponent> {
    return this.dialog.open(TranslationSuggestionsDialogComponent, {
      panelClass: 'dialog-md',
      data: {
        defaultLanguage: this.defaultLanguage.language,
        currentLanguage: this.currentLanguage().language,
        defaultLanguageContent: this.content[this.key],
        currentLanguageContent: this.translationText
      }
    });
  }
}
