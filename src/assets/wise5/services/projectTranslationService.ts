import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, lastValueFrom, Observable, of, switchMap } from 'rxjs';
import { Translations } from '../../../app/domain/translations';
import { ConfigService } from './configService';
import { ProjectService } from './projectService';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Injectable()
export class ProjectTranslationService {
  protected configService = inject(ConfigService);
  protected http = inject(HttpClient);
  protected projectService = inject(ProjectService);

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

  protected fetchTranslations(locale: string): Observable<Translations> {
    return this.http
      .get<Translations>(this.getTranslationMappingURL(locale), {
        headers: new HttpHeaders().set('cache-control', 'no-cache')
      })
      .pipe(catchError(() => of({})));
  }

  private getTranslationMappingURL(locale: string): string {
    return this.configService
      .getConfigParam('projectURL')
      .replace('project.json', `translations.${locale}.json`);
  }

  applyTranslations(projectElement: object, translations: Translations): void {
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
