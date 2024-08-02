import { Injectable, WritableSignal, signal } from '@angular/core';
import { Observable, catchError, lastValueFrom, map, throwError } from 'rxjs';
import { TeacherProjectService } from './teacherProjectService';
import { Translations } from '../../../app/domain/translations';
import { ProjectTranslationService } from './projectTranslationService';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './configService';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable()
export class TeacherProjectTranslationService extends ProjectTranslationService {
  private currentTranslationsSignal: WritableSignal<Translations> = signal({});
  readonly currentTranslations = this.currentTranslationsSignal.asReadonly();
  constructor(
    protected configService: ConfigService,
    protected http: HttpClient,
    protected projectService: TeacherProjectService
  ) {
    super(configService, http, projectService);
    toObservable(this.projectService.currentLanguage).subscribe(async (language) => {
      this.currentTranslationsSignal.set(
        this.projectService.isDefaultLocale()
          ? {}
          : await lastValueFrom(this.fetchTranslations(language.locale))
      );
    });
  }

  saveCurrentTranslations(translations: Translations): Observable<void> {
    this.projectService.broadcastSavingProject();
    return this.http
      .post<void>(
        `/api/author/project/translate/${this.configService.getProjectId()}/${
          this.projectService.currentLanguage().locale
        }`,
        translations
      )
      .pipe(
        map(() => {
          this.currentTranslationsSignal.set(translations);
          this.projectService.broadcastProjectSaved();
        }),
        catchError(() => {
          this.projectService.broadcastErrorSavingProject();
          return throwError(
            () => new Error($localize`Error saving translation. Please try again later.`)
          );
        })
      );
  }
}
