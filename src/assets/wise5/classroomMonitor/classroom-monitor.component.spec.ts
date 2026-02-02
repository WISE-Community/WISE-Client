import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassroomMonitorTestingModule } from './classroom-monitor-testing.module';
import { ClassroomMonitorComponent } from './classroom-monitor.component';
import { provideRouter } from '@angular/router';
import { NotebookService } from '../services/notebookService';
import { TeacherProjectService } from '../services/teacherProjectService';
import { TopBarComponent } from './classroomMonitorComponents/shared/top-bar/top-bar.component';
import { MainMenuComponent } from '../common/main-menu/main-menu.component';
import { WorkgroupService } from '../../../app/services/workgroup.service';
import { ConfigService } from '../services/configService';
import { TeacherDataService } from '../services/teacherDataService';

let component: ClassroomMonitorComponent;
let fixture: ComponentFixture<ClassroomMonitorComponent>;
describe('ClassroomMonitorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ClassroomMonitorComponent,
        ClassroomMonitorTestingModule,
        MainMenuComponent,
        TopBarComponent
      ],
      providers: [
        provideRouter([]),
        WorkgroupService
      ]
    }).compileComponents();
    const notebookService = TestBed.inject(NotebookService);
    spyOn(notebookService, 'isNotebookEnabled').and.returnValue(true);
    spyOn(notebookService, 'getTeacherNotebookConfig').and.returnValue({});
    const projectService = TestBed.inject(TeacherProjectService);
    spyOn(projectService, 'getAchievements').and.returnValue({});
    const configService = TestBed.inject(ConfigService);
    spyOn(configService, 'getPermissions').and.returnValue({
      canViewStudentNames: true,
      canGradeStudentWork: true,
      canAuthorProject: true
    });
    spyOn(configService, 'getMyUserInfo').and.returnValue({
      userIds: [1],
      firstName: 'wise',
      lastName: 'panda',
      username: 'wisepanda'
    });
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentPeriod').and.returnValue({
      periodId: 1
    });
    spyOn(TestBed.inject(TeacherDataService), 'getPeriods').and.returnValue([{ periodId: 1 }]);
    fixture = TestBed.createComponent(ClassroomMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
