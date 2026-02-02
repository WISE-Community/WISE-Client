import { inject, Injectable } from '@angular/core';
import { lastValueFrom, of, tap } from 'rxjs';
import { copy } from '../common/object/object';
import { Translations } from '../../../app/domain/translations';
import { ProjectTranslationService } from './projectTranslationService';
import { Language } from '../../../app/domain/language';
import { StudentDataService } from './studentDataService';

@Injectable()
export class StudentProjectTranslationService extends ProjectTranslationService {
  private dataService = inject(StudentDataService);

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
}
