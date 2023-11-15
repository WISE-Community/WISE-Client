import { Injectable } from '@angular/core';
import { ProjectService } from './projectService';
import { ConfigService } from './configService';
import { Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { copy } from '../common/object/object';

@Injectable()
export class TranslateProjectService {
  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private projectService: ProjectService
  ) {}

  translate(locale = 'en_US'): Observable<any> {
    const project = this.revertToOriginalProject();
    return this.projectService.getLocale().hasTranslationsToApply(locale)
      ? this.http
          .get(this.getTranslationMappingURL(locale), {
            headers: new HttpHeaders().set('cache-control', 'no-cache')
          })
          .pipe(
            tap((translations: any) => {
              this.applyTranslations(project, translations);
              this.projectService.setProject(project);
            })
          )
      : of({});
  }

  private revertToOriginalProject(): any {
    const project = copy(this.projectService.getOriginalProject());
    this.projectService.setProject(project);
    return project;
  }

  private getTranslationMappingURL(locale: string): string {
    return this.configService.getConfigParam('projectURL').replace('.json', `.${locale}.json`);
  }

  private applyTranslations(projectElement: any, translations: any): void {
    Object.keys(projectElement)
      .filter((key) => key.endsWith('.i18nId'))
      .forEach((key) => {
        const translationKey = projectElement[key];
        if (translations[translationKey]) {
          const keyWithoutI18NId = key.substring(0, key.lastIndexOf('.i18nId'));
          projectElement[keyWithoutI18NId] = translations[translationKey];
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
