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

  async initializeStudent(unitId: string) {
    await this.configService.retrieveConfig(`/api/config/studentRun/${unitId}`);
    this.sessionService.initializeSession();
    this.studentStatusService.retrieveStudentStatus();
    await this.projectService.retrieveProject();
    this.studentWebSocketService.initialize();
    await this.studentDataService.retrieveStudentData();
    await this.notificationService.retrieveNotifications();
    await this.achievementService.retrieveStudentAchievements();
    await this.studentDataService.retrieveRunStatus();
    await this.studentAssetService.retrieveAssets();
    await this.notebookService.retrieveNotebookItems(this.configService.getWorkgroupId());
    this.intializedSource.next(true);
  }

  async initializePreview(unitId: string) {
    await this.configService.retrieveConfig(`/api/config/preview/${unitId}`);
    this.sessionService.initializeSession();
    this.studentStatusService.retrieveStudentStatus();
    await this.projectService.retrieveProject();
    this.studentDataService.retrieveStudentData();
    this.studentDataService.retrieveRunStatus();
    this.notificationService.retrieveNotifications();
    this.intializedSource.next(true);
  }
}
