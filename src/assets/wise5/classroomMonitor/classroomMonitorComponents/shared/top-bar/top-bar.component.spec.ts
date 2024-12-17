import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfigService } from '../../../../services/configService';
import { NotificationService } from '../../../../services/notificationService';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { PauseScreensMenuComponent } from '../../pause-screens-menu/pause-screens-menu.component';
import { NotificationsMenuComponent } from '../notifications-menu/notifications-menu.component';
import { TopBarComponent } from './top-bar.component';
import { provideRouter } from '@angular/router';

describe('TopBarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopBarComponent],
      imports: [
        ClassroomMonitorTestingModule,
        NotificationsMenuComponent,
        PauseScreensMenuComponent,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatToolbarModule,
        MatTooltipModule
      ],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(ConfigService), 'getMyUserInfo').and.returnValue({});
    spyOn(TestBed.inject(ConfigService), 'getPermissions').and.returnValue({
      canAuthorProject: true,
      canGradeStudentWork: true,
      canViewStudentNames: true
    });
    spyOn(
      TestBed.inject(NotificationService),
      'getLatestActiveNotificationsFromUniqueSource'
    ).and.returnValue([]);
    spyOn(
      TestBed.inject(NotificationService),
      'getDismissedNotificationsForWorkgroup'
    ).and.returnValue([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
