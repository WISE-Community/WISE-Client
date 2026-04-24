import { Injectable } from '@angular/core';
import { lastValueFrom, of, tap } from 'rxjs';
import { copy } from '../common/object/object';
import { Translations } from '../../../app/domain/translations';
import { ProjectTranslationService } from './projectTranslationService';
import { Language } from '../../../app/domain/language';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './configService';
import { ProjectService } from './projectService';
import { StudentDataService } from './studentDataService';

@Injectable()
export class StudentProjectTranslationService extends ProjectTranslationService {
  constructor(
    protected configService: ConfigService,
    private dataService: StudentDataService,
    protected http: HttpClient,
    protected projectService: ProjectService
  ) {
    super(configService, http, projectService);
  }

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
