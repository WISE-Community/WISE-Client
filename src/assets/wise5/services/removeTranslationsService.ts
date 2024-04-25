import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, lastValueFrom } from 'rxjs';
import { Translations } from '../../../app/domain/translations';
import { ComponentContent } from '../common/ComponentContent';
import { ConfigService } from './configService';
import { Language } from '../../../app/domain/language';
import { ProjectTranslationService } from './projectTranslationService';
import { TeacherProjectService } from './teacherProjectService';

@Injectable()
export class RemoveTranslationsService extends ProjectTranslationService {
  constructor(
    protected configService: ConfigService,
    protected http: HttpClient,
    protected projectService: TeacherProjectService
  ) {
    super(configService, http, projectService);
  }

  async removeComponent(componentElement: ComponentContent): Promise<void> {
    const allTranslations = await this.fetchAllTranslations();
    const i18nKeys = this.getI18NKeys(componentElement);
    const saveTranslationRequests: Observable<Object>[] = [];
    allTranslations.forEach((translations, language) => {
      i18nKeys.forEach((i18nKey) => delete translations[i18nKey]);
      saveTranslationRequests.push(
        this.http.post(
          `/api/author/project/translate/${this.configService.getProjectId()}/${language.locale}`,
          translations
        )
      );
    });
    forkJoin(saveTranslationRequests).subscribe();
  }

  private async fetchAllTranslations(): Promise<Map<Language, Translations>> {
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

  private getI18NKeys(componentElement: object): string[] {
    let i18nKeys = Object.keys(componentElement)
      .filter((key) => key.endsWith('.i18n'))
      .map((key) => componentElement[key].id);
    Object.values(componentElement).forEach((value) => {
      if (Array.isArray(value)) {
        i18nKeys = i18nKeys.concat(...value.map((val) => this.getI18NKeys(val)));
      } else if (typeof value === 'object' && value != null) {
        i18nKeys = i18nKeys.concat(this.getI18NKeys(value));
      }
    });
    return i18nKeys;
  }
}
