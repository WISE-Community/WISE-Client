import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './configService';
import { TeacherDataService } from './teacherDataService';
import { compressToEncodedURIComponent } from 'lz-string';
import { Observable, tap } from 'rxjs';

@Injectable()
export class DataExportService {
  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private dataService: TeacherDataService
  ) {}

  retrieveStudentData(
    selectedNodes = [],
    includeStudentWork: boolean,
    includeEvents: boolean,
    includeAnnotations: boolean
  ): Observable<any> {
    let params = this.createHttpParams(includeStudentWork, includeEvents, includeAnnotations);
    if (selectedNodes.length > 0) {
      params = params.set(
        'components',
        compressToEncodedURIComponent(JSON.stringify(selectedNodes))
      );
    }
    return this.dataService.retrieveStudentData(params);
  }

  retrieveEventsExport(
    includeStudentEvents: boolean,
    includeTeacherEvents: boolean,
    includeNames: boolean
  ): Observable<any> {
    const params = new HttpParams()
      .set('runId', this.configService.getRunId())
      .set('getStudentWork', 'false')
      .set('getAnnotations', 'false')
      .set('getEvents', 'false')
      .set('includeStudentEvents', includeStudentEvents + '')
      .set('includeTeacherEvents', includeTeacherEvents + '')
      .set('includeNames', includeNames + '');
    return this.http.get(this.configService.getConfigParam('runDataExportURL') + '/events', {
      params: params
    });
  }

  getStudentEvents(events: any[]): any[] {
    return events.filter((event: any) => {
      return this.isStudentEvent(event);
    });
  }

  getTeacherEvents(events: any[]): any[] {
    return events.filter((event: any) => {
      return this.isTeacherEvent(event);
    });
  }

  isStudentEvent(event: any): boolean {
    return !this.isTeacherEvent(event);
  }

  isTeacherEvent(event: any): boolean {
    return (
      this.configService.isTeacherWorkgroupId(event.workgroupId) ||
      this.configService.isTeacherUserId(event.userId)
    );
  }

  retrieveNotebookExport(exportType: string): Observable<any> {
    const options = { params: new HttpParams().set('exportType', exportType) };
    return this.http.get(this.configService.getConfigParam('notebookURL'), options);
  }

  retrieveNotificationsExport(): Observable<any> {
    return this.http.get(this.getExportURL(this.configService.getRunId(), 'notifications'));
  }

  retrieveStudentAssetsExport(): Promise<any> {
    window.location.href = this.getExportURL(this.configService.getRunId(), 'studentAssets');
    return new Promise((resolve) => {
      resolve([]);
    });
  }

  private createHttpParams(
    includeStudentWork: boolean,
    includeEvents: boolean,
    includeAnnotations: boolean
  ): HttpParams {
    return new HttpParams()
      .set('runId', this.configService.getRunId())
      .set('getStudentWork', includeStudentWork)
      .set('getEvents', includeEvents)
      .set('getAnnotations', includeAnnotations);
  }

  getExportURL(runId: number, exportType: string): string {
    return this.configService.getConfigParam('runDataExportURL') + `/${runId}/${exportType}`;
  }
}
