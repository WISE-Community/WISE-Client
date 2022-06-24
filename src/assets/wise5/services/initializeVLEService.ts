import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { VLEProjectService } from '../vle/vleProjectService';
import { AchievementService } from './achievementService';
import { ConfigService } from './configService';
import { NotebookService } from './notebookService';
import { NotificationService } from './notificationService';
import { SessionService } from './sessionService';
import { StudentAssetService } from './studentAssetService';
import { StudentDataService } from './studentDataService';
import { StudentStatusService } from './studentStatusService';
import { StudentWebSocketService } from './studentWebSocketService';

@Injectable()
export class InitializeVLEService {
  private intializedSource: Subject<boolean> = new Subject<boolean>();
  public initialized$: Observable<boolean> = this.intializedSource.asObservable();

  constructor(
    private achievementService: AchievementService,
    private configService: ConfigService,
    private notebookService: NotebookService,
    private notificationService: NotificationService,
    private projectService: VLEProjectService,
    private sessionService: SessionService,
    private studentAssetService: StudentAssetService,
    private studentDataService: StudentDataService,
    private studentStatusService: StudentStatusService,
    private studentWebSocketService: StudentWebSocketService
  ) {}

  initializeStudent(unitId: string) {
    return this.configService.retrieveConfig(`/api/config/studentRun/${unitId}`).then(() => {
      this.sessionService.initializeSession();
      this.studentStatusService.retrieveStudentStatus();
      return this.projectService.retrieveProject().then(() => {
        this.studentWebSocketService.initialize();
        return this.studentDataService.retrieveStudentData().then(() => {
          this.notificationService.retrieveNotifications();
          this.achievementService.retrieveStudentAchievements();
          return this.studentDataService.retrieveRunStatus().then(() => {
            return this.studentAssetService.retrieveAssets().then((studentAssets) => {
              return this.notebookService
                .retrieveNotebookItems(this.configService.getWorkgroupId())
                .then((notebook) => {
                  this.intializedSource.next(true);
                  return notebook;
                });
            });
          });
        });
      });
    });
  }

  initializePreview(unitId: string) {
    return this.configService.retrieveConfig(`/api/config/preview/${unitId}`).then(() => {
      this.sessionService.initializeSession();
      this.studentStatusService.retrieveStudentStatus();
      return this.projectService.retrieveProject().then(() => {
        this.studentDataService.retrieveStudentData();
        this.studentDataService.retrieveRunStatus();
        this.notificationService.retrieveNotifications();
        this.intializedSource.next(true);
      });
    });
  }
}
