import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './configService';
import { TeacherDataService } from './teacherDataService';

@Injectable()
export class DataExportService {
  constructor(
    private ConfigService: ConfigService,
    private http: HttpClient,
    private TeacherDataService: TeacherDataService
  ) {}

  retrieveStudentDataExport(selectedNodes = []): Promise<any> {
    let params = this.createHttpParams('true', 'false', 'true');
    for (const selectedNode of selectedNodes) {
      params = params.append('components', JSON.stringify(selectedNode));
    }
    return this.TeacherDataService.retrieveStudentData(params);
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

  retrieveOneWorkgroupPerRowExport(selectedNodes = []): Promise<any> {
    let params = this.createHttpParams('true', 'true', 'true');
    for (const selectedNode of selectedNodes) {
      params = params.append('components', JSON.stringify(selectedNode));
    }
    return this.TeacherDataService.retrieveStudentData(params);
  }

  retrieveStudentAssetsExport(): Promise<any> {
    window.location.href = this.getExportURL(this.ConfigService.getRunId(), 'studentAssets');
    return new Promise((resolve) => {
      resolve([]);
    });
  }

  retrieveRawDataExport(selectedNodes: any[] = []): Promise<any> {
    let params = this.createHttpParams('true', 'true', 'true');
    for (const selectedNode of selectedNodes) {
      params = params.append('components', JSON.stringify(selectedNode));
    }
    return this.TeacherDataService.retrieveStudentData(params);
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
