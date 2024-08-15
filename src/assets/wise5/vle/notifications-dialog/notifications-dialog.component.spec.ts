import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NotificationService } from '../../services/notificationService';
import { NotificationsDialogComponent } from './notifications-dialog.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { NodeService } from '../../services/nodeService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NotificationsMenuComponent', () => {
  let component: NotificationsDialogComponent;
  let dismissNotificationSpy: any;
  let fixture: ComponentFixture<NotificationsDialogComponent>;
  const nodeId1 = 'node1';
  let notification1: any;
  let notification2: any;
  let notification3: any;
  let notificationAggregate1: any;
  let notificationAggregate2: any;
  const teacherToStudentType = 'teacherToStudent';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [NotificationsDialogComponent],
    imports: [MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatToolbarModule,
        StudentTeacherCommonServicesModule],
    providers: [
        {
            provide: MatDialogRef,
            useValue: { close: () => { } }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsDialogComponent);
    component = fixture.componentInstance;
    notification1 = createNotification(nodeId1, teacherToStudentType, 'Hello1', null);
    notification2 = createNotification(nodeId1, teacherToStudentType, 'Hello2', null);
    notification3 = createNotification(nodeId1, teacherToStudentType, 'Hello3', 'dismiss');
    notificationAggregate1 = createNotificationAggregate(nodeId1, 'Hello', [
      notification1,
      notification2
    ]);
    notificationAggregate2 = createNotificationAggregate(nodeId1, 'Hello', [
      notification1,
      notification3
    ]);
    dismissNotificationSpy = spyOn(TestBed.inject(NotificationService), 'dismissNotification');
    fixture.detectChanges();
  });

  function createNotification(
    nodeId: string,
    type: string,
    message: string,
    dismissCode: string
  ): any {
    return {
      data: {
        dismissCode
      },
      message: message,
      nodeId: nodeId,
      type: type
    };
  }

  function createNotificationAggregate(nodeId: string, message: string, notifications: any[]): any {
    return {
      message: message,
      nodeId: nodeId,
      notifications: notifications
    };
  }

  it('should dismiss notification aggregate and visit node', () => {
    const setCurrentNodeSpy = spyOn(
      TestBed.inject(NodeService),
      'setCurrentNode'
    ).and.callFake(() => {});
    component.dismissNotificationAggregateAndVisitNode(notificationAggregate1);
    expect(dismissNotificationSpy).toHaveBeenCalledTimes(2);
    expect(setCurrentNodeSpy).toHaveBeenCalledWith(nodeId1);
  });

  it('should dismiss notification aggregate that does not require dismiss code', () => {
    component.dismissNotificationAggregate(notificationAggregate1);
    expect(dismissNotificationSpy).toHaveBeenCalledTimes(2);
  });

  it('should dismiss notification aggregate that does require dismiss code', () => {
    const broadcastViewCurrentAmbientNotificationSpy = spyOn(
      TestBed.inject(NotificationService),
      'broadcastViewCurrentAmbientNotification'
    );
    component.dismissNotificationAggregate(notificationAggregate2);
    expect(dismissNotificationSpy).toHaveBeenCalledTimes(1);
    expect(broadcastViewCurrentAmbientNotificationSpy).toHaveBeenCalled();
  });

  it('should dismiss all notifications', () => {
    component.newNotifications = [notificationAggregate1, notificationAggregate2];
    const dismissNotificationAggregateSpy = spyOn(component, 'dismissNotificationAggregate');
    spyOn(window, 'confirm').and.callFake(function () {
      return true;
    });
    component.dismissAll();
    expect(dismissNotificationAggregateSpy).toHaveBeenCalledTimes(2);
  });
});
