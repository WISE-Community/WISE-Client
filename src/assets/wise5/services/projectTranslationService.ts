import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { ConfigService } from './configService';
import { ProjectService } from './projectService';
import { Translations } from '../../../app/domain/translations';

@Injectable()
export class ProjectTranslationService {
  constructor(
    protected configService: ConfigService,
    protected http: HttpClient,
    protected projectService: ProjectService
  ) {}

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
