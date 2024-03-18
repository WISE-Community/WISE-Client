import { Injectable, WritableSignal, signal } from '@angular/core';
import { Observable, catchError, lastValueFrom, map, throwError } from 'rxjs';
import { TeacherProjectService } from './teacherProjectService';
import { Translations } from '../../../app/domain/translations';
import { ProjectTranslationService } from './projectTranslationService';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './configService';
import { ProjectService } from './projectService';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable()
export class EditProjectTranslationService extends ProjectTranslationService {
  currentTranslations: WritableSignal<Translations> = signal({});
  constructor(
    protected configService: ConfigService,
    protected http: HttpClient,
    protected projectService: ProjectService
  ) {
    super(configService, http, projectService);
    toObservable(this.projectService.currentLanguage).subscribe(async (language) => {
      this.currentTranslations.set(await lastValueFrom(this.fetchTranslations(language.locale)));
    });
  }

  saveCurrentTranslations(translations: Translations): Observable<void> {
    return this.http
      .post<void>(
        `/api/author/project/translate/${this.configService.getProjectId()}/${
          this.projectService.currentLanguage().locale
        }`,
        translations
      )
      .pipe(
        map(() => {
          this.currentTranslations.set(translations);
        }),
        catchError(() => {
          (this.projectService as TeacherProjectService).broadcastErrorSavingProject();
          return throwError(
            () => new Error($localize`Error saving translation. Please try again later.`)
          );
        })
      );
  }
}
