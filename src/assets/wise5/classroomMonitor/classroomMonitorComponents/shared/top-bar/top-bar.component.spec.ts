import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UpgradeModule } from '@angular/upgrade/static';
import { ConfigService } from '../../../../services/configService';
import { NotificationService } from '../../../../services/notificationService';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { PauseScreensMenuComponent } from '../../pause-screens-menu/pause-screens-menu.component';
import { NotificationsMenuComponent } from '../notifications-menu/notifications-menu.component';

import { TopBarComponent } from './top-bar.component';

class MockUpgradeModule {
  $injector: any = {
    get() {
      return {};
    }
  };
}

describe('TopBarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationsMenuComponent, PauseScreensMenuComponent, TopBarComponent],
      imports: [
        ClassroomMonitorTestingModule,
        FormsModule,
        MatDividerModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatToolbarModule,
        MatTooltipModule
      ],
      providers: [{ provide: UpgradeModule, useClass: MockUpgradeModule }]
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
