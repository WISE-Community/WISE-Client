import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { NotificationService } from '../../assets/wise5/services/notificationService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { UtilService } from '../../assets/wise5/services/utilService';
import { SessionService } from '../../assets/wise5/services/sessionService';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Notification } from '../domain/notification';
import { MatDialogModule } from '@angular/material/dialog';

let configService: ConfigService;
let http: HttpTestingController;
let notification1: Notification;
let notification2: Notification;
let notification3: Notification;
let notification4: Notification;
let notification5: Notification;
let notification6: Notification;
let notifications = [];
let service: NotificationService;

const componentId1 = 'component1';
const componentId2 = 'component2';
const discussionReplyType = 'DiscussionReply';
const nodeId1 = 'node1';
const nodeId2 = 'node2';
const peerChatMessageType = 'PeerChatMessage';
const runId1 = 1;
const timeDismissed = 10000;
const workgroupId1 = 1;
const workgroupId2 = 2;
const workgroupId3 = 3;

const retrieveNotificationsURL = `/notifications/${runId1}`;

describe('NotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, UpgradeModule],
      providers: [
        AnnotationService,
        ConfigService,
        NotificationService,
        ProjectService,
        SessionService,
        UtilService
      ]
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(NotificationService);
    configService = TestBed.inject(ConfigService);
    spyOn(configService, 'getNotificationURL').and.returnValue(retrieveNotificationsURL);
    notifications = createTestNotifications();
    service.notifications = notifications;
  });
  retrieveNotifications_Teacher_ShouldReturnAndSetNotifications();
  getLatestActiveNotificationsFromUniqueSource_ShouldReturnNotificationsFromUniqueSource();
  getDismissedNotificationsForWorkgroup_ShouldReturnDismissedNotifications();
  dismissNotification_MultipleFromSameSource_ShouldDismissAllFromSameSource();
});

function createTestNotifications(): Notification[] {
  notification1 = createNotification(
    nodeId2,
    componentId2,
    workgroupId2,
    workgroupId3,
    discussionReplyType
  );
  notification2 = createNotification(
    nodeId1,
    componentId1,
    workgroupId2,
    workgroupId1,
    peerChatMessageType,
    timeDismissed
  );
  notification3 = createNotification(
    nodeId1,
    componentId1,
    workgroupId2,
    workgroupId1,
    peerChatMessageType,
    timeDismissed
  );
  notification4 = createNotification(
    nodeId1,
    componentId1,
    workgroupId2,
    workgroupId1,
    peerChatMessageType
  );
  notification5 = createNotification(
    nodeId1,
    componentId1,
    workgroupId3,
    workgroupId1,
    peerChatMessageType
  );
  notification6 = createNotification(
    nodeId1,
    componentId1,
    workgroupId2,
    workgroupId1,
    peerChatMessageType
  );
  return [notification1, notification2, notification3, notification4, notification5, notification6];
}

function createNotification(
  nodeId: string,
  componentId: string,
  fromWorkgroupId: number,
  toWorkgroupId: number,
  type: string,
  timeDismissed: number = null
): Notification {
  const notification = new Notification();
  notification.nodeId = nodeId;
  notification.componentId = componentId;
  notification.fromWorkgroupId = fromWorkgroupId;
  notification.toWorkgroupId = toWorkgroupId;
  notification.type = type;
  notification.timeDismissed = timeDismissed;
  return notification;
}

function retrieveNotifications_Teacher_ShouldReturnAndSetNotifications() {
  it('retrieve and set notifications for current run', () => {
    const notificationsExpected = [notification1];
    service.retrieveNotifications().then((notifications: any) => {
      expect(notifications.length).toEqual(1);
    });
    http.expectOne(retrieveNotificationsURL).flush(notificationsExpected);
  });
}

function getLatestActiveNotificationsFromUniqueSource_ShouldReturnNotificationsFromUniqueSource() {
  it('should get latest active notifications from unique source', () => {
    const latestActiveNotificationsFromUniqueSource = service.getLatestActiveNotificationsFromUniqueSource(
      notifications,
      workgroupId1
    );
    expect(latestActiveNotificationsFromUniqueSource.length).toEqual(2);
    expect(latestActiveNotificationsFromUniqueSource[0]).toEqual(notification6);
    expect(latestActiveNotificationsFromUniqueSource[1]).toEqual(notification5);
  });
}

function getDismissedNotificationsForWorkgroup_ShouldReturnDismissedNotifications() {
  it('should get dismissed notifications for workgroup', () => {
    const dismissedNotifications = service.getDismissedNotificationsForWorkgroup(
      notifications,
      workgroupId1
    );
    expect(dismissedNotifications.length).toEqual(2);
    expect(dismissedNotifications[0]).toEqual(notification2);
    expect(dismissedNotifications[1]).toEqual(notification3);
  });
}

function dismissNotification_MultipleFromSameSource_ShouldDismissAllFromSameSource() {
  it('should dismiss all notifications from same source', () => {
    const httpPostSpy = spyOn(TestBed.inject(HttpClient), 'post').and.callFake(
      (url: string, body: any): any => {
        return of(body);
      }
    );
    const addNotificationSpy = spyOn(service, 'addNotification').and.callThrough();
    service.dismissNotification(notification6);
    expect(httpPostSpy).toHaveBeenCalledTimes(2);
    expect(addNotificationSpy).toHaveBeenCalledTimes(2);
  });
}
