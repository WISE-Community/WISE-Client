'use strict';

import { Injectable } from '@angular/core';
import { ConfigService } from './configService';
import { ClassroomStatusService } from './classroomStatusService';
import { NotificationService } from './notificationService';
import { Observable, Subject } from 'rxjs';
import { AchievementService } from './achievementService';
import { RxStomp } from '@stomp/rx-stomp';
import { Message } from '@stomp/stompjs';

@Injectable()
export class TeacherWebSocketService {
  runId: number;
  rxStomp: RxStomp;
  private newAnnotationReceivedSource: Subject<any> = new Subject<any>();
  public newAnnotationReceived$: Observable<any> = this.newAnnotationReceivedSource.asObservable();
  private newStudentWorkReceivedSource: Subject<any> = new Subject<any>();
  public newStudentWorkReceived$: Observable<any> = this.newStudentWorkReceivedSource.asObservable();

  constructor(
    private AchievementService: AchievementService,
    private classroomStatusService: ClassroomStatusService,
    private ConfigService: ConfigService,
    private NotificationService: NotificationService
  ) {}

  initialize() {
    this.runId = this.ConfigService.getRunId();
    this.initializeStomp();
    this.subscribeToTeacherTopic();
    this.subscribeToTeacherWorkgroupTopic();
  }

  initializeStomp() {
    this.rxStomp = new RxStomp();
    this.rxStomp.configure({
      brokerURL: this.ConfigService.getWebSocketURL()
    });
    this.rxStomp.activate();
  }

  subscribeToTeacherTopic() {
    this.rxStomp.watch(`/topic/teacher/${this.runId}`).subscribe((message: Message) => {
      const body = JSON.parse(message.body);
      if (body.type === 'studentWork') {
        const studentWork = JSON.parse(body.content);
        this.broadcastNewStudentWorkReceived({ studentWork: studentWork });
      } else if (body.type === 'studentStatus') {
        const status = JSON.parse(body.content);
        this.classroomStatusService.setStudentStatus(status);
        this.classroomStatusService.broadcastStudentStatusReceived({ studentStatus: status });
      } else if (body.type === 'newStudentAchievement') {
        const achievement = JSON.parse(body.content);
        this.AchievementService.broadcastNewStudentAchievement({ studentAchievement: achievement });
      } else if (body.type === 'annotation') {
        const annotationData = JSON.parse(body.content);
        this.broadcastNewAnnotationReceived({ annotation: annotationData });
      }
    });
  }

  broadcastNewStudentWorkReceived(args: any) {
    this.newStudentWorkReceivedSource.next(args);
  }

  broadcastNewAnnotationReceived(args: any) {
    this.newAnnotationReceivedSource.next(args);
  }

  subscribeToTeacherWorkgroupTopic() {
    this.rxStomp
      .watch(`/topic/workgroup/${this.ConfigService.getWorkgroupId()}`)
      .subscribe((message: Message) => {
        const body = JSON.parse(message.body);
        if (body.type === 'notification') {
          this.NotificationService.addNotification(JSON.parse(body.content));
        }
      });
  }

  pauseScreens(periodId: number): void {
    this.rxStomp.publish({ destination: `/app/pause/${this.runId}/${periodId}` });
  }

  unPauseScreens(periodId: number): void {
    this.rxStomp.publish({ destination: `/app/unpause/${this.runId}/${periodId}` });
  }

  sendNodeToClass(periodId: number, node: any) {
    this.rxStomp.publish({
      destination: `/app/api/teacher/run/${this.runId}/node-to-period/${periodId}`,
      body: JSON.stringify(node)
    });
  }
}
