import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowMyWorkGradingComponent } from './show-my-work-grading.component';
import { ShowMyWorkGradingModule } from './show-my-work-grading.module';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TeacherDataService } from '../../../services/teacherDataService';
import { ProjectService } from '../../../services/projectService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';
import { ClassroomStatusService } from '../../../services/classroomStatusService';

let component: ShowMyWorkGradingComponent;
const componentId: string = 'component1';
let fixture: ComponentFixture<ShowMyWorkGradingComponent>;
const nodeId: string = 'node1';
let projectService: ProjectService;
let teacherDataService: TeacherDataService;
const workgroupId: number = 100;

describe('ShowMyWorkGradingComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowMyWorkGradingComponent],
      imports: [
        HttpClientTestingModule,
        ShowMyWorkGradingModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [
        ClassroomStatusService,
        ProjectService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService
      ]
    });
    projectService = TestBed.inject(ProjectService);
    spyOn(projectService, 'getComponent').and.returnValue({
      id: componentId,
      type: 'OpenResponse'
    });
    teacherDataService = TestBed.inject(TeacherDataService);
    spyOn(
      teacherDataService,
      'getLatestComponentStateByWorkgroupIdNodeIdAndComponentId'
    ).and.returnValue({
      componentId: componentId,
      nodeId: nodeId,
      studentData: {},
      workgroupId: workgroupId
    });
    fixture = TestBed.createComponent(ShowMyWorkGradingComponent);
    component = fixture.componentInstance;
    component.nodeId = nodeId;
    component.componentId = componentId;
    component.workgroupId = workgroupId;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
