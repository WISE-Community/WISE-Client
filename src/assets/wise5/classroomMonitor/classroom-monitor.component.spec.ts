import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassroomMonitorTestingModule } from './classroom-monitor-testing.module';
import { ClassroomMonitorComponent } from './classroom-monitor.component';
import { provideRouter } from '@angular/router';
import { NotebookService } from '../services/notebookService';
import { TeacherProjectService } from '../services/teacherProjectService';
import { MockComponent } from 'ng-mocks';
import { TopBarComponent } from './classroomMonitorComponents/shared/top-bar/top-bar.component';
import { MainMenuComponent } from '../common/main-menu/main-menu.component';
import { WorkgroupService } from '../../../app/services/workgroup.service';
import { ToolBarComponent } from './classroomMonitorComponents/shared/tool-bar/tool-bar.component';

let component: ClassroomMonitorComponent;
let fixture: ComponentFixture<ClassroomMonitorComponent>;
describe('ClassroomMonitorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(MainMenuComponent),
        MockComponent(ToolBarComponent),
        MockComponent(TopBarComponent)
      ],
      imports: [ClassroomMonitorComponent, ClassroomMonitorTestingModule],
      providers: [provideRouter([]), WorkgroupService]
    }).compileComponents();
    const notebookService = TestBed.inject(NotebookService);
    spyOn(notebookService, 'isNotebookEnabled').and.returnValue(true);
    spyOn(notebookService, 'getTeacherNotebookConfig').and.returnValue({});
    const projectService = TestBed.inject(TeacherProjectService);
    spyOn(projectService, 'getAchievements').and.returnValue({});
    fixture = TestBed.createComponent(ClassroomMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
