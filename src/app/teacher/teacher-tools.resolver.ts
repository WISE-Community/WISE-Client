import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { ConfigService } from '../../assets/wise5/services/configService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { TeacherDataService } from '../../assets/wise5/services/teacherDataService';
import { ClassroomStatusService } from '../../assets/wise5/services/classroomStatusService';
import { NotificationService } from '../../assets/wise5/services/notificationService';
import { TeacherWebSocketService } from '../../assets/wise5/services/teacherWebSocketService';
import { NotebookService } from '../../assets/wise5/services/notebookService';

export const TeacherToolsResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  classroomStatusService: ClassroomStatusService = inject(ClassroomStatusService),
  configService: ConfigService = inject(ConfigService),
  dataService: TeacherDataService = inject(TeacherDataService),
  notebookService: NotebookService = inject(NotebookService),
  notificationService: NotificationService = inject(NotificationService),
  projectService: ProjectService = inject(ProjectService),
  websocketService: TeacherWebSocketService = inject(TeacherWebSocketService)
): Observable<any> =>
  configService
    .retrieveConfig(`api/config/classroomMonitor/${route.params['unitId']}`)
    .pipe(switchMap(() => projectService.retrieveProject()))
    .pipe(switchMap(() => classroomStatusService.retrieveStudentStatuses()))
    .pipe(switchMap(() => dataService.retrieveRunStatus()))
    .pipe(switchMap(() => notificationService.retrieveNotifications()))
    .pipe(switchMap(() => dataService.retrieveAnnotations()))
    .pipe(switchMap(() => notebookService.retrieveNotebookItems()))
    .pipe(tap(() => websocketService.initialize()));
