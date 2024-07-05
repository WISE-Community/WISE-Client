import { HttpClient } from '@angular/common/http';
import { ConfigService } from './configService';
import { ProjectTranslationService } from './projectTranslationService';
import { TeacherProjectService } from './teacherProjectService';
import { lastValueFrom } from 'rxjs';
import { Translations } from '../../../app/domain/translations';
import { Language } from '../../../app/domain/language';
import { Injectable } from '@angular/core';

@Injectable()
export class EditTranslationsService extends ProjectTranslationService {
  constructor(
    protected configService: ConfigService,
    protected http: HttpClient,
    protected projectService: TeacherProjectService
  ) {
    super(configService, http, projectService);
  }

  protected async fetchAllTranslations(): Promise<Map<Language, Translations>> {
    const allTranslations = new Map<Language, Translations>();
    await Promise.all(
      this.projectService
        .getLocale()
        .getSupportedLanguages()
        .map(async (language) => {
          allTranslations.set(
            language,
            await lastValueFrom(this.fetchTranslations(language.locale))
          );
        })
    );
    return allTranslations;
  }
}
