import { HttpClient } from '@angular/common/http';
import { ConfigService } from './configService';
import { ProjectTranslationService } from './projectTranslationService';
import { TeacherProjectService } from './teacherProjectService';
import { lastValueFrom, Observable } from 'rxjs';
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

  protected getI18NKeys(componentElement: object): any[] {
    let i18nKeys = Object.keys(componentElement)
      .filter((key) => key.endsWith('.i18n'))
      .map((key) => this.getI18NKey(componentElement, key));
    Object.values(componentElement).forEach((value) => {
      if (Array.isArray(value)) {
        i18nKeys = i18nKeys.concat(...value.map((val) => this.getI18NKeys(val)));
      } else if (typeof value === 'object' && value != null) {
        i18nKeys = i18nKeys.concat(this.getI18NKeys(value));
      }
    });
    return i18nKeys;
  }

  protected getI18NKey(componentElement: object, key: string): any {
    return componentElement[key].id;
  }

  protected getSaveTranslationRequest(
    translations: Translations,
    language: Language
  ): Observable<Object> {
    return this.http.post(
      `/api/author/project/translate/${this.configService.getProjectId()}/${language.locale}`,
      translations
    );
  }
}
