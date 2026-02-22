import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Notification } from '../../../../../../app/domain/notification';
import { NotificationService } from '../../../../services/notificationService';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { NotificationsMenuComponent } from './notifications-menu.component';
import { provideRouter } from '@angular/router';

let component: NotificationsMenuComponent;
let dismissNotificationSpy: jasmine.Spy;
let fixture: ComponentFixture<NotificationsMenuComponent>;
const NODE_ID_1: string = 'node1';
const NODE_ID_2: string = 'node1';
const notification1 = new Notification({ nodeId: NODE_ID_1 });
const notification2 = new Notification({ nodeId: NODE_ID_2 });
describe('NotificationsMenuComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomMonitorTestingModule, NotificationsMenuComponent],
      providers: [
        { provide: MatDialog, useValue: { open: () => {} } },
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsMenuComponent);
    component = fixture.componentInstance;
    component.state = { go: () => {} };
    dismissNotificationSpy = spyOn(TestBed.inject(NotificationService), 'dismissNotification');
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
      component['confirmDismissAllNotifications']();
      expect(dialogOpenSpy).toHaveBeenCalled();
      expect(dismissNotificationSpy).toHaveBeenCalledTimes(2);
    });
  });
}

function dismissNotification() {
  describe('dismissNotification', () => {
    it('should dismiss notification', () => {
      component['dismissNotification'](notification1);
      expect(dismissNotificationSpy).toHaveBeenCalledWith(notification1);
    });
  });
}

function visitNode() {
  describe('visitNode', () => {
    it('should visit node', () => {
      const routerSpy = spyOn(component['router'], 'navigate');
      component['visitNode'](notification1);
      expect(routerSpy).toHaveBeenCalled();
    });
  });
}
