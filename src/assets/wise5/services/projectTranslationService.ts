import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Translations } from '../../../app/domain/translations';
import { ConfigService } from './configService';
import { ProjectService } from './projectService';

@Injectable()
export class ProjectTranslationService {
  protected configService = inject(ConfigService);
  protected http = inject(HttpClient);
  protected projectService = inject(ProjectService);

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
}
