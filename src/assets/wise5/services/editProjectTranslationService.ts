import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './configService';
import { TeacherProjectService } from './teacherProjectService';
import { Translations } from '../../../app/domain/translations';

@Injectable()
export class EditProjectTranslationService {
  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private projectService: TeacherProjectService
  ) {}

  saveCurrentTranslations(translations: Translations): Observable<void> {
    return this.http
      .post<void>(
        `/api/author/project/translate/${this.configService.getProjectId()}/${
          this.projectService.currentLanguage().locale
        }`,
        translations
      )
      .pipe(
        catchError(() => {
          this.projectService.broadcastErrorSavingProject();
          return throwError(
            () => new Error($localize`Error saving translation. Please try again later.`)
          );
        })
      );
  }
}
