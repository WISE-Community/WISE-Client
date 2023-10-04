import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './configService';
import { ProjectService } from './projectService';
import { Notification } from '../../../app/domain/notification';
import { Observable, Subject } from 'rxjs';
import { AnnotationService } from './annotationService';
import { DismissAmbientNotificationDialogComponent } from '../vle/dismiss-ambient-notification-dialog/dismiss-ambient-notification-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { generateRandomKey } from '../common/string/string';

@Injectable()
export class NotificationService {
  notifications: Notification[] = [];
  private notificationChangedSource: Subject<any> = new Subject<any>();
  public notificationChanged$: Observable<any> = this.notificationChangedSource.asObservable();
  private setGlobalMessageSource: Subject<any> = new Subject<any>();
  public setGlobalMessage$: Observable<any> = this.setGlobalMessageSource.asObservable();
  private setIsJSONValidSource: Subject<any> = new Subject<any>();
  public setIsJSONValid$: Observable<any> = this.setIsJSONValidSource.asObservable();
  private serverConnectionStatusSource: Subject<any> = new Subject<any>();
  public serverConnectionStatus$: Observable<any> = this.serverConnectionStatusSource.asObservable();
  private viewCurrentAmbientNotificationSource: Subject<any> = new Subject<any>();
  public viewCurrentAmbientNotification$: Observable<any> = this.viewCurrentAmbientNotificationSource.asObservable();

  constructor(
    protected annotationService: AnnotationService,
    protected dialog: MatDialog,
    protected http: HttpClient,
    protected ConfigService: ConfigService,
    protected ProjectService: ProjectService
  ) {}

  /**
   * Creates a new notification object
   * @param notificationType type of notification [component, node, annotation, etc]
   * @param nodeId id of node
   * @param componentId id of component
   * @param fromWorkgroupId id of workgroup that created this notification
   * @param toWorkgroupId id of workgroup this notification is for
   * @param message notification message
   * @param data other extra information about this notification
   * @param groupId id that groups multiple notifications together
   * @returns newly created notification object
   */
  createNewNotification(
    runId,
    periodId,
    notificationType,
    nodeId,
    componentId,
    fromWorkgroupId,
    toWorkgroupId,
    message,
    data = null,
    groupId = null
  ): Notification {
    const nodePosition = this.ProjectService.getNodePositionById(nodeId);
    const nodePositionAndTitle = this.ProjectService.getNodePositionAndTitle(nodeId);
    const component = this.ProjectService.getComponent(nodeId, componentId);
    let componentType = null;
    if (component != null) {
      componentType = component.type;
    }
    return new Notification({
      id: null,
      runId: runId,
      periodId: periodId,
      type: notificationType,
      nodeId: nodeId,
      groupId: groupId,
      componentId: componentId,
      componentType: componentType,
      nodePosition: nodePosition,
      nodePositionAndTitle: nodePositionAndTitle,
      fromWorkgroupId: fromWorkgroupId,
      toWorkgroupId: toWorkgroupId,
      message: message,
      data: data,
      timeGenerated: Date.parse(new Date().toString()),
      timeDismissed: null
    });
  }

  retrieveNotifications() {
    if (this.ConfigService.isPreview()) {
      this.notifications = [];
      return;
    }
    const options: any = {};
    if (this.ConfigService.getMode() === 'studentRun') {
      options.params = new HttpParams()
        .set('periodId', this.ConfigService.getPeriodId())
        .set('toWorkgroupId', this.ConfigService.getWorkgroupId());
    }
    return this.http
      .get(this.ConfigService.getNotificationURL(), options)
      .toPromise()
      .then((notifications: any) => {
        this.notifications = notifications;
        this.notifications.map((notification: Notification) => {
          this.setNotificationNodePositionAndTitle(notification);
        });
        return this.notifications;
      });
  }

  getNewNotifications(): any[] {
    const newNotificationAggregates = [];
    this.notifications
      .filter((notification) => notification.timeDismissed == null)
      .forEach((notification) => {
        const notificationNodeId = notification.nodeId;
        const notificationType = notification.type;
        let newNotificationForNodeIdAndTypeExists = false;
        for (const newNotificationAggregate of newNotificationAggregates) {
          if (
            newNotificationAggregate.nodeId == notificationNodeId &&
            newNotificationAggregate.type == notificationType
          ) {
            newNotificationForNodeIdAndTypeExists = true;
            newNotificationAggregate.notifications.push(notification);
            if (notification.timeGenerated > newNotificationAggregate.latestNotificationTimestamp) {
              newNotificationAggregate.latestNotificationTimestamp = notification.timeGenerated;
            }
          }
        }
        let notebookItemId = null; // if this notification was created because teacher commented on a notebook report.
        if (!newNotificationForNodeIdAndTypeExists) {
          let message = '';
          if (notificationType === 'DiscussionReply') {
            message = $localize`You have new replies to your discussion post!`;
          } else if (notificationType === 'teacherToStudent') {
            message = $localize`You have new feedback from your teacher!`;
            if (notification.data != null) {
              if (typeof notification.data === 'string') {
                notification.data = JSON.parse(notification.data);
              }

              const annotationId = (notification.data as any).annotationId;
              if (annotationId != null) {
                const annotation = this.annotationService.getAnnotationById(annotationId);
                if (annotation != null && annotation.notebookItemId != null) {
                  notebookItemId = annotation.notebookItemId;
                }
              }
            }
          } else if (notificationType === 'CRaterResult') {
            message = $localize`You have new feedback!`;
          } else {
            message = notification.message;
          }
          newNotificationAggregates.push({
            latestNotificationTimestamp: notification.timeGenerated,
            message: message,
            nodeId: notificationNodeId,
            notebookItemId: notebookItemId,
            notifications: [notification],
            type: notificationType
          });
        }
      });
    return newNotificationAggregates.sort(
      (n1, n2) => n2.latestNotificationTimestamp - n1.latestNotificationTimestamp
    );
  }

  setNotificationNodePositionAndTitle(notification: Notification) {
    notification.nodePosition = this.ProjectService.getNodePositionById(notification.nodeId);
    notification.nodePositionAndTitle = this.ProjectService.getNodePositionAndTitle(
      notification.nodeId
    );
  }

  sendNotificationForScore(notificationForScore) {
    const notificationType = notificationForScore.notificationType;
    if (notificationForScore.isNotifyTeacher || notificationForScore.isNotifyStudent) {
      const fromWorkgroupId = this.ConfigService.getWorkgroupId();
      const runId = this.ConfigService.getRunId();
      const periodId = this.ConfigService.getPeriodId();
      const notificationGroupId = runId + '_' + generateRandomKey(); // links student and teacher notifications together
      const notificationData: any = {};
      if (notificationForScore.isAmbient) {
        notificationData.isAmbient = true;
      }
      if (notificationForScore.dismissCode != null) {
        notificationData.dismissCode = notificationForScore.dismissCode;
      }
      if (notificationForScore.isNotifyStudent) {
        this.sendNotificationToUser(
          notificationForScore.notificationMessageToStudent,
          fromWorkgroupId,
          notificationForScore,
          runId,
          periodId,
          notificationType,
          this.ConfigService.getWorkgroupId(),
          notificationData,
          notificationGroupId
        ).then((notification) => {
          this.addNotification(notification);
        });
      }
      if (notificationForScore.isNotifyTeacher) {
        this.sendNotificationToUser(
          notificationForScore.notificationMessageToTeacher,
          fromWorkgroupId,
          notificationForScore,
          runId,
          periodId,
          notificationType,
          this.ConfigService.getTeacherWorkgroupId(),
          notificationData,
          notificationGroupId
        );
      }
    }
  }

  private sendNotificationToUser(
    notificationMessageTemplate: string,
    fromWorkgroupId: number,
    notificationForScore: any,
    runId: number,
    periodId: any,
    notificationType: string,
    toWorkgroupId: number,
    notificationData: any,
    notificationGroupId: string
  ) {
    const notificationMessage = notificationMessageTemplate
      .replace('{{username}}', this.ConfigService.getUsernameByWorkgroupId(fromWorkgroupId))
      .replace('{{score}}', notificationForScore.score)
      .replace('{{dismissCode}}', notificationForScore.dismissCode);
    const notification = this.createNewNotification(
      runId,
      periodId,
      notificationType,
      notificationForScore.nodeId,
      notificationForScore.componentId,
      fromWorkgroupId,
      toWorkgroupId,
      notificationMessage,
      notificationData,
      notificationGroupId
    );
    return this.saveNotificationToServer(notification);
  }

  saveNotificationToServer(notification) {
    if (this.ConfigService.isPreview()) {
      return this.pretendServerRequest(notification);
    } else {
      return this.http
        .post(this.ConfigService.getNotificationURL(), notification)
        .toPromise()
        .then((notification: Notification) => {
          return notification;
        });
    }
  }

  dismissNotification(notification: Notification): void {
    if (this.ConfigService.isPreview()) {
      this.pretendServerRequest(notification);
    }
    const notificationsToDismiss = this.getActiveNotificationsWithSameSource(
      this.notifications,
      notification
    );
    this.dismissNotifications(notificationsToDismiss);
  }

  private getActiveNotificationsWithSameSource(
    notifications: Notification[],
    notificationToCompare: Notification
  ): Notification[] {
    const sourceKey = this.getSourceKey(notificationToCompare);
    return notifications.filter(
      (notification) =>
        this.isActiveNotification(notification) && this.getSourceKey(notification) === sourceKey
    );
  }

  dismissNotifications(notifications: Notification[]): void {
    notifications.forEach((notification: any) => {
      notification.timeDismissed = Date.parse(new Date().toString());
      return this.http
        .post(`${this.ConfigService.getNotificationURL()}/dismiss`, notification)
        .subscribe((notification: Notification) => {
          this.addNotification(notification);
        });
    });
  }

  getLatestActiveNotificationsFromUniqueSource(
    notifications: Notification[],
    workgroupId: number
  ): Notification[] {
    const notificationsToWorkgroup = this.getNotificationsSentToWorkgroup(
      notifications,
      workgroupId
    );
    const activeNotifications = this.getActiveNotifications(notificationsToWorkgroup);
    return this.getLatestUniqueSourceNotifications(activeNotifications);
  }

  private getNotificationsSentToWorkgroup(
    notifications: Notification[],
    workgroupId: number
  ): Notification[] {
    return notifications.filter((notification) => notification.toWorkgroupId === workgroupId);
  }

  private getActiveNotifications(notifications: Notification[]): Notification[] {
    return notifications.filter((notification) => {
      return this.isActiveNotification(notification);
    });
  }

  private isActiveNotification(notification: Notification): boolean {
    return notification.timeDismissed == null;
  }

  getDismissedNotificationsForWorkgroup(
    notifications: Notification[],
    workgroupId: number
  ): Notification[] {
    const notificationsToWorkgroup = this.getNotificationsSentToWorkgroup(
      notifications,
      workgroupId
    );
    return this.getDismissedNotifications(notificationsToWorkgroup);
  }

  private getDismissedNotifications(notifications: Notification[]): Notification[] {
    return notifications.filter((notification) => notification.timeDismissed != null);
  }

  private getLatestUniqueSourceNotifications(notifications: Notification[]): Notification[] {
    const sourcesFound = new Set<string>();
    const latestUniqueSourceNotifications = [];
    for (let n = notifications.length - 1; n >= 0; n--) {
      const notification = notifications[n];
      const sourceKey = this.getSourceKey(notification);
      if (!sourcesFound.has(sourceKey)) {
        latestUniqueSourceNotifications.push(notification);
        sourcesFound.add(sourceKey);
      }
    }
    return latestUniqueSourceNotifications;
  }

  private getSourceKey(notification: Notification): string {
    const { nodeId, componentId, fromWorkgroupId, toWorkgroupId, type } = notification;
    return `${nodeId}-${componentId}-${fromWorkgroupId}-${toWorkgroupId}-${type}`;
  }

  private pretendServerRequest(notification) {
    return Promise.resolve(notification);
  }

  /**
   * Returns all notifications for the given parameters
   * @param args object of optional parameters to filter on
   * (e.g. nodeId, componentId, toWorkgroupId, fromWorkgroupId, periodId, type)
   * @returns array of notificaitons
   */
  private getNotifications(args) {
    let notifications = this.notifications;
    for (const p in args) {
      if (args.hasOwnProperty(p) && args[p] !== null) {
        notifications = notifications.filter((notification) => {
          return notification[p] === args[p];
        });
      }
    }
    return notifications;
  }

  /**
   * Returns all CRaterResult notifications for given parameters
   * TODO: expand to encompass other notification types that should be shown in classroom monitor
   * @param args object of optional parameters to filter on (e.g. nodeId, componentId, toWorkgroupId, fromWorkgroupId, periodId)
   * @returns array of cRater notificaitons
   */
  getAlertNotifications(args) {
    // get all CRaterResult notifications for the given parameters
    // TODO: expand to encompass other notification types that should be shown to teacher
    let alertNotifications = [];
    const nodeId = args.nodeId;
    const params = args;
    params.type = 'CRaterResult';

    if (args.periodId) {
      params.periodId = args.periodId === -1 ? null : args.periodId;
    }

    if (nodeId && this.ProjectService.isGroupNode(nodeId)) {
      const groupNode = this.ProjectService.getNodeById(nodeId);
      const children = groupNode.ids;
      for (let childId of children) {
        params.nodeId = childId;
        const childAlerts = this.getAlertNotifications(args);
        alertNotifications = alertNotifications.concat(childAlerts);
      }
    } else {
      alertNotifications = this.getNotifications(params);
    }
    return alertNotifications;
  }

  addNotification(notification: Notification) {
    this.setNotificationNodePositionAndTitle(notification);
    for (let n = 0; n < this.notifications.length; n++) {
      if (this.notifications[n].id === notification.id) {
        this.notifications[n] = notification;
        this.broadcastNotificationChanged(notification);
        return;
      }
    }
    this.notifications.push(notification);
    this.broadcastNotificationChanged(notification);
  }

  displayAmbientNotification(notification: Notification): void {
    const dialogRef = this.dialog.open(DismissAmbientNotificationDialogComponent, {
      data: notification
    });
    dialogRef.componentInstance.dismiss$.subscribe((notification: Notification) => {
      this.dismissNotification(notification);
    });
  }

  broadcastNotificationChanged(notification: Notification) {
    this.notificationChangedSource.next(notification);
  }

  showJSONValidMessage() {
    this.setIsJSONValidMessage(true);
  }

  showJSONInvalidMessage() {
    this.setIsJSONValidMessage(false);
  }

  hideJSONValidMessage() {
    this.setIsJSONValidMessage(null);
  }

  /**
   * Show the message in the toolbar that says "JSON Valid" or "JSON Invalid".
   * @param isJSONValid
   * true if we want to show "JSON Valid"
   * false if we want to show "JSON Invalid"
   * null if we don't want to show anything
   */
  setIsJSONValidMessage(isJSONValid) {
    this.broadcastSetIsJSONValid({ isJSONValid: isJSONValid });
  }

  broadcastSetGlobalMessage(args) {
    this.setGlobalMessageSource.next(args);
  }

  broadcastSetIsJSONValid(args) {
    this.setIsJSONValidSource.next(args);
  }

  broadcastServerConnectionStatus(isConnected: boolean) {
    this.serverConnectionStatusSource.next(isConnected);
  }

  broadcastViewCurrentAmbientNotification(args: any) {
    this.viewCurrentAmbientNotificationSource.next(args);
  }
}
