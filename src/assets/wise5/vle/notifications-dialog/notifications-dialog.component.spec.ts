import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NotebookService } from '../../services/notebookService';
import { NotificationService } from '../../services/notificationService';
import { ProjectService } from '../../services/projectService';
import { SessionService } from '../../services/sessionService';
import { StudentAssetService } from '../../services/studentAssetService';
import { StudentDataService } from '../../services/studentDataService';
import { TagService } from '../../services/tagService';
import { UtilService } from '../../services/utilService';
import { NotificationsDialogComponent } from './notifications-dialog.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

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
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatToolbarModule,
        UpgradeModule
      ],
      declarations: [NotificationsDialogComponent],
      providers: [
        AnnotationService,
        ConfigService,
        NotebookService,
        NotificationService,
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        TagService,
        UtilService,
        {
          provide: MatDialogRef,
          useValue: { close: () => {} }
        }
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
    const endCurrentNodeAndSetCurrentNodeByNodeIdSpy = spyOn(
      TestBed.inject(StudentDataService),
      'endCurrentNodeAndSetCurrentNodeByNodeId'
    ).and.callFake(() => {});
    component.dismissNotificationAggregateAndVisitNode(notificationAggregate1);
    expect(dismissNotificationSpy).toHaveBeenCalledTimes(2);
    expect(endCurrentNodeAndSetCurrentNodeByNodeIdSpy).toHaveBeenCalledWith(nodeId1);
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
  })
});
