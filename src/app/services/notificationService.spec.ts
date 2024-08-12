import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NotificationService } from '../../assets/wise5/services/notificationService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { of } from 'rxjs';
import { Notification } from '../domain/notification';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';

let configService: ConfigService;
let http: HttpTestingController;
let notification1,
  notification2,
  notification3,
  notification4,
  notification5,
  notification6: Notification;
let notifications: Notification[];
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
    imports: [MatDialogModule, StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
  notification1 = new Notification({
    nodeId: nodeId2,
    componentId: componentId2,
    fromWorkgroupId: workgroupId2,
    toWorkgroupId: workgroupId3,
    type: discussionReplyType,
    timeDismissed: timeDismissed
  });
  notification2 = new Notification({
    nodeId: nodeId1,
    componentId: componentId1,
    fromWorkgroupId: workgroupId2,
    toWorkgroupId: workgroupId1,
    type: peerChatMessageType,
    timeDismissed: timeDismissed
  });
  notification3 = new Notification({
    nodeId: nodeId1,
    componentId: componentId1,
    fromWorkgroupId: workgroupId2,
    toWorkgroupId: workgroupId1,
    type: peerChatMessageType,
    timeDismissed: timeDismissed
  });
  notification4 = new Notification({
    nodeId: nodeId1,
    componentId: componentId1,
    fromWorkgroupId: workgroupId2,
    toWorkgroupId: workgroupId1,
    type: peerChatMessageType,
    timeDismissed: null
  });
  notification5 = new Notification({
    nodeId: nodeId1,
    componentId: componentId1,
    fromWorkgroupId: workgroupId3,
    toWorkgroupId: workgroupId1,
    type: peerChatMessageType,
    timeDismissed: null
  });
  notification6 = new Notification({
    nodeId: nodeId1,
    componentId: componentId1,
    fromWorkgroupId: workgroupId2,
    toWorkgroupId: workgroupId1,
    type: peerChatMessageType,
    timeDismissed: null
  });
  return [notification1, notification2, notification3, notification4, notification5, notification6];
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
    expect(
      service.getLatestActiveNotificationsFromUniqueSource(notifications, workgroupId1)
    ).toEqual([notification6, notification5]);
  });
}

function getDismissedNotificationsForWorkgroup_ShouldReturnDismissedNotifications() {
  it('should get dismissed notifications for workgroup', () => {
    expect(service.getDismissedNotificationsForWorkgroup(notifications, workgroupId1)).toEqual([
      notification2,
      notification3
    ]);
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
