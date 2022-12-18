import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './configService';
import { TeacherDataService } from './teacherDataService';
import { compressToEncodedURIComponent } from 'lz-string';

@Injectable()
export class DataExportService {
  constructor(
    private ConfigService: ConfigService,
    private http: HttpClient,
    private TeacherDataService: TeacherDataService
  ) {}

  retrieveStudentDataExport(selectedNodes = []): Promise<any> {
    let params = this.createHttpParams('true', 'false', 'true');
    if (selectedNodes.length > 0) {
      params = params.set(
        'components',
        compressToEncodedURIComponent(JSON.stringify(selectedNodes))
      );
    }
    return this.TeacherDataService.retrieveStudentData(params);
  }

  retrieveEventsExport(
    includeStudentEvents: boolean,
    includeTeacherEvents: boolean,
    includeNames: boolean
  ): Promise<any> {
    const params = new HttpParams()
      .set('runId', this.ConfigService.getRunId())
      .set('getStudentWork', 'false')
      .set('getAnnotations', 'false')
      .set('getEvents', 'false')
      .set('includeStudentEvents', includeStudentEvents + '')
      .set('includeTeacherEvents', includeTeacherEvents + '')
      .set('includeNames', includeNames + '');
    const options = {
      params: params
    };
    const url = this.ConfigService.getConfigParam('runDataExportURL') + '/events';
    return this.http
      .get(url, options)
      .toPromise()
      .then(({ events }: any): any[] => {
        return events;
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
      this.ConfigService.isTeacherWorkgroupId(event.workgroupId) ||
      this.ConfigService.isTeacherUserId(event.userId)
    );
  }

  retrieveNotebookExport(exportType: string): Promise<any> {
    const options = { params: new HttpParams().set('exportType', exportType) };
    return this.http
      .get(this.ConfigService.getConfigParam('notebookURL'), options)
      .toPromise()
      .then((data: any) => {
        return data;
      });
  }

  retrieveNotificationsExport(): Promise<any> {
    return this.http
      .get(this.getExportURL(this.ConfigService.getRunId(), 'notifications'))
      .toPromise()
      .then((data: any) => {
        return data;
      });
  }

  retrieveStudentAssetsExport(): Promise<any> {
    window.location.href = this.getExportURL(this.ConfigService.getRunId(), 'studentAssets');
    return new Promise((resolve) => {
      resolve([]);
    });
  }

  private createHttpParams(studentWork: string, events: string, annotations: string): HttpParams {
    return new HttpParams()
      .set('runId', this.ConfigService.getRunId())
      .set('getStudentWork', studentWork)
      .set('getEvents', events)
      .set('getAnnotations', annotations);
  }

  getExportURL(runId: number, exportType: string): string {
    return this.ConfigService.getConfigParam('runDataExportURL') + `/${runId}/${exportType}`;
  }
}
