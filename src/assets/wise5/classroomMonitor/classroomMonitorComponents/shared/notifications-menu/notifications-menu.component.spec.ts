import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { of } from 'rxjs';
import { Notification } from '../../../../../../app/domain/notification';
import { DialogWithConfirmComponent } from '../../../../directives/dialog-with-confirm/dialog-with-confirm.component';
import { NotificationService } from '../../../../services/notificationService';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { NotificationsMenuComponent } from './notifications-menu.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: NotificationsMenuComponent;
let dismissNotificationSpy: jasmine.Spy;
let fixture: ComponentFixture<NotificationsMenuComponent>;
const NODE_ID_1: string = 'node1';
const NODE_ID_2: string = 'node1';
const NODE_ROUTE = 'root.cm.unit.node';
const notification1 = new Notification({ nodeId: NODE_ID_1 });
const notification2 = new Notification({ nodeId: NODE_ID_2 });
let stateGoSpy: jasmine.Spy;

describe('NotificationsMenuComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [DialogWithConfirmComponent, NotificationsMenuComponent],
    imports: [ClassroomMonitorTestingModule,
        MatDialogModule,
        MatIconModule,
        MatToolbarModule],
    providers: [{ provide: MatDialog, useValue: { open: () => { } } }, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsMenuComponent);
    component = fixture.componentInstance;
    component.state = { go: () => {} };
    dismissNotificationSpy = spyOn(TestBed.inject(NotificationService), 'dismissNotification');
    stateGoSpy = spyOn(component.state, 'go');
    fixture.detectChanges();
  });

  confirmDismissAllNotifications();
  dismissNotification();
  visitNode();
});

function confirmDismissAllNotifications() {
  describe('confirmDismissAllNotifications', () => {
    it('should open the confirm dismiss all notifications dialog and answer yes', () => {
      const dialogOpenSpy = spyOn(TestBed.inject(MatDialog), 'open');
      dialogOpenSpy.and.returnValue({
        afterClosed: () => {
          return of(true);
        }
      } as any);
      component.newNotifications = [notification1, notification2];
      component.confirmDismissAllNotifications();
      expect(dialogOpenSpy).toHaveBeenCalled();
      expect(dismissNotificationSpy).toHaveBeenCalledTimes(2);
    });
  });
}

function dismissNotification() {
  describe('dismissNotification', () => {
    it('should dismiss notification', () => {
      component.dismissNotification(notification1);
      expect(dismissNotificationSpy).toHaveBeenCalledWith(notification1);
    });
  });
}

function visitNode() {
  describe('visitNode', () => {
    it('should visit node', () => {
      component.visitNode(notification1);
      expect(stateGoSpy).toHaveBeenCalledWith(NODE_ROUTE, { nodeId: NODE_ID_1 });
    });
  });
}
