import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../../services/configService';
import { NotificationService } from '../../../../services/notificationService';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { TopBarComponent } from './top-bar.component';
import { provideRouter } from '@angular/router';

describe('TopBarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomMonitorTestingModule, TopBarComponent],
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
