import { inject, Injectable } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { lastValueFrom, of, switchMap, tap } from 'rxjs';
import { Language } from '../../../app/domain/language';
import { Translations } from '../../../app/domain/translations';
import { copy } from '../common/object/object';
import { ProjectTranslationService } from './projectTranslationService';
import { StudentDataService } from './studentDataService';

@Injectable()
export class StudentProjectTranslationService extends ProjectTranslationService {
  private dataService = inject(StudentDataService);

  currentTranslations = toSignal(
    toObservable(this.projectService.currentLanguage).pipe(
      switchMap((language) =>
        this.projectService.getLocale().isDefaultLocale(language.locale)
          ? of({})
          : lastValueFrom(this.fetchTranslations(language.locale))
      )
    ),
    { initialValue: {} }
  );

  async switchLanguage(language: Language, requester: 'student' | 'system'): Promise<void> {
    this.projectService.setCurrentLanguage(language);
    await this.translate(language.locale);
    this.dataService.saveVLEEvent(
      this.dataService.getCurrentNodeId(),
      null,
      null,
      'Language',
      'languageSelected',
      { language: language.locale, requester: requester }
    );
  }

  private translate(locale = 'en_US'): Promise<any> {
    const project = this.revertToOriginalProject();
    return lastValueFrom(
      this.projectService.getLocale().hasTranslationsToApply(locale)
        ? this.fetchTranslations(locale).pipe(
            tap((translations: Translations) => {
              this.applyTranslations(project, translations);
              this.projectService.setProject(project);
            })
          )
        : of({})
    );
  }

  private revertToOriginalProject(): any {
    const project = copy(this.projectService.getOriginalProject());
    this.projectService.setProject(project);
    return project;
  }

  private applyTranslations(projectElement: object, translations: Translations): void {
    Object.keys(projectElement)
      .filter((key) => key.endsWith('.i18n'))
      .forEach((key) => {
        const translationKey = projectElement[key].id;
        if (translations[translationKey]) {
          const keyWithoutI18NId = key.substring(0, key.lastIndexOf('.i18n'));
          projectElement[keyWithoutI18NId] = translations[translationKey].value;
        }
      });
    Object.values(projectElement).forEach((value) => {
      if (Array.isArray(value)) {
        value.forEach((val) => this.applyTranslations(val, translations));
      } else if (typeof value === 'object' && value != null) {
        this.applyTranslations(value, translations);
      }
    });
  }
}
