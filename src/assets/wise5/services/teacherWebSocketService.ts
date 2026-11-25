'use strict';

import { Injectable } from '@angular/core';
import { ConfigService } from './configService';
import { ClassroomStatusService } from './classroomStatusService';
import { NotificationService } from './notificationService';
import {
  catchError,
  debounceTime,
  EMPTY,
  Observable,
  Subject,
  Subscription,
  switchMap
} from 'rxjs';
import { AchievementService } from './achievementService';
import { RxStomp } from '@stomp/rx-stomp';
import { Message } from '@stomp/stompjs';
import { Annotation } from '../common/Annotation';

@Injectable()
export class TeacherWebSocketService {
  runId: number;
  rxStomp: RxStomp;
  private newAnnotationReceivedSource: Subject<Annotation> = new Subject<Annotation>();
  public newAnnotationReceived$: Observable<Annotation> =
    this.newAnnotationReceivedSource.asObservable();
  private newStudentWorkReceivedSource: Subject<any> = new Subject<any>();
  public newStudentWorkReceived$: Observable<any> =
    this.newStudentWorkReceivedSource.asObservable();
  private subscriptions: Subscription = new Subscription();
  private workgroupJoinedSource: Subject<void> = new Subject<void>();

  constructor(
    private AchievementService: AchievementService,
    private classroomStatusService: ClassroomStatusService,
    private configService: ConfigService,
    private NotificationService: NotificationService
  ) {}

  initialize() {
    this.disconnect();
    this.runId = this.configService.getRunId();
    this.initializeStomp();
    this.subscribeToTeacherTopic();
    this.subscribeToTeacherWorkgroupTopic();
    this.subscribeToClassroomTopics();
    this.subscribeToWorkgroupJoined();
  }

  private disconnect(): void {
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
    this.rxStomp?.deactivate();
  }

  initializeStomp() {
    this.rxStomp = new RxStomp();
    this.rxStomp.configure({
      brokerURL: this.configService.getWebSocketURL()
    });
    this.subscriptions.add(this.rxStomp.connected$.subscribe(() => this.refreshStudentStatuses()));
    this.rxStomp.activate();
  }

  // The broker keeps nothing for a disconnected subscriber, so statuses sent while the socket was
  // down can only be recovered by fetching them again.
  private refreshStudentStatuses(): void {
    this.subscriptions.add(
      this.classroomStatusService.refreshStudentStatuses().subscribe({
        next: (changedStatuses) => {
          for (const studentStatus of changedStatuses) {
            this.classroomStatusService.broadcastStudentStatusReceived({ studentStatus });
          }
        },
        error: () => {}
      })
    );
  }

  subscribeToTeacherTopic() {
    this.subscriptions.add(
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
          this.AchievementService.broadcastNewStudentAchievement(achievement);
        } else if (body.type === 'annotation') {
          this.broadcastNewAnnotationReceived(JSON.parse(body.content));
        }
      })
    );
  }

  broadcastNewStudentWorkReceived(args: any) {
    this.newStudentWorkReceivedSource.next(args);
  }

  broadcastNewAnnotationReceived(annotation: Annotation): void {
    this.newAnnotationReceivedSource.next(annotation);
  }

  subscribeToTeacherWorkgroupTopic() {
    this.subscriptions.add(
      this.rxStomp
        .watch(`/topic/workgroup/${this.configService.getWorkgroupId()}`)
        .subscribe((message: Message) => {
          const body = JSON.parse(message.body);
          if (body.type === 'notification') {
            this.NotificationService.addNotification(JSON.parse(body.content));
          }
        })
    );
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

  private subscribeToClassroomTopics(): void {
    for (const period of this.configService.getPeriods()) {
      this.subscriptions.add(
        this.rxStomp
          .watch(`/topic/classroom/${this.configService.getRunId()}/${period.periodId}`)
          .subscribe((message: Message) => {
            const body = JSON.parse(message.body);
            if (body.type === 'newWorkgroupJoinedRun') {
              this.workgroupJoinedSource.next();
            }
          })
      );
    }
  }

  private subscribeToWorkgroupJoined(): void {
    this.subscriptions.add(
      this.workgroupJoinedSource
        .pipe(
          debounceTime(2000),
          switchMap(() =>
            this.configService
              .retrieveConfig(`/api/config/classroomMonitor/${this.runId}`)
              .pipe(catchError(() => EMPTY))
          )
        )
        .subscribe()
    );
  }
}
