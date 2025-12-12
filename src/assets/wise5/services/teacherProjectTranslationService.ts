import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { catchError, lastValueFrom, map, Observable, throwError } from 'rxjs';
import { Translations } from '../../../app/domain/translations';
import { ProjectTranslationService } from './projectTranslationService';
import { TeacherProjectService } from './teacherProjectService';

@Injectable()
export class TeacherProjectTranslationService extends ProjectTranslationService {
  protected override projectService = inject(TeacherProjectService);

  private currentTranslationsSignal: WritableSignal<Translations> = signal({});
  readonly currentTranslations = this.currentTranslationsSignal.asReadonly();

  constructor() {
    super();
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
