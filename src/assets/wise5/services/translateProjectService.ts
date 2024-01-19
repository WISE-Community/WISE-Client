import { Injectable } from '@angular/core';
import { ProjectService } from './projectService';
import { ConfigService } from './configService';
import { Observable, lastValueFrom, of, switchMap, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { copy } from '../common/object/object';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Translations } from '../../../app/domain/translations';

@Injectable()
export class TranslateProjectService {
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

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private projectService: ProjectService
  ) {}

  translate(locale = 'en_US'): Promise<any> {
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

  private fetchTranslations(locale: string): Observable<Translations> {
    return this.http.get<Translations>(this.getTranslationMappingURL(locale), {
      headers: new HttpHeaders().set('cache-control', 'no-cache')
    });
  }

  private getTranslationMappingURL(locale: string): string {
    return this.configService
      .getConfigParam('projectURL')
      .replace('project.json', `translations.${locale}.json`);
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
