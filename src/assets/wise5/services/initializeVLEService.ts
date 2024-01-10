import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { VLEProjectService } from '../vle/vleProjectService';
import { AchievementService } from './achievementService';
import { ConfigService } from './configService';
import { NodeClickLockedService } from './nodeClickLockedService';
import { NotebookService } from './notebookService';
import { PauseScreenService } from './pauseScreenService';
import { SessionService } from './sessionService';
import { StompService } from './stompService';
import { StudentAssetService } from './studentAssetService';
import { StudentDataService } from './studentDataService';
import { StudentNotificationService } from './studentNotificationService';
import { StudentStatusService } from './studentStatusService';
import { StudentWebSocketService } from './studentWebSocketService';

@Injectable()
export class InitializeVLEService {
  private intializedSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public initialized$: Observable<boolean> = this.intializedSource.asObservable();

  constructor(
    private achievementService: AchievementService,
    private configService: ConfigService,
    private nodeClickLockedService: NodeClickLockedService,
    private notebookService: NotebookService,
    private notificationService: StudentNotificationService,
    private pauseScreenService: PauseScreenService,
    private projectService: VLEProjectService,
    private sessionService: SessionService,
    private stompService: StompService,
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
    await this.stompService.initialize();
    this.studentWebSocketService.initialize();
    await this.studentDataService.retrieveStudentData();
    await this.notificationService.retrieveNotifications();
    await this.achievementService.retrieveStudentAchievements();
    await this.studentDataService.retrieveRunStatus();
    this.pauseScreenService.initialize();
    this.notificationService.initialize();
    this.nodeClickLockedService.initialize();
    await this.studentAssetService.retrieveAssets();
    await this.notebookService.retrieveNotebookItems(this.configService.getWorkgroupId());
    this.intializedSource.next(true);
  }

  async initializePreview(unitId: string) {
    await this.configService.retrieveConfig(`/api/config/preview/${unitId}`);
    this.studentStatusService.retrieveStudentStatus();
    await this.projectService.retrieveProject();
    this.studentDataService.retrieveStudentData();
    this.studentDataService.retrieveRunStatus();
    this.notificationService.retrieveNotifications();
    this.nodeClickLockedService.initialize();
    this.intializedSource.next(true);
  }
}
