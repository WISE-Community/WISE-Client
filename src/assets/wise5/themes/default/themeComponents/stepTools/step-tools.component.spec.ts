import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { NodeStatusService } from '../../../../services/nodeStatusService';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { StepToolsComponent } from './step-tools.component';
import { StudentDataService } from '../../../../services/studentDataService';
import { StudentService } from '../../../../../../app/student/student.service';
import { StudentTeacherCommonServicesModule } from '../../../../../../app/student-teacher-common-services.module';
import { VLEProjectService } from '../../../../vle/vleProjectService';
import { of } from 'rxjs';
import { RunInfo } from '../../../../../../app/student/run-info';

const nodeId1 = 'node1';
const nodeStatus1 = { icon: '', isCompleted: true };
const nodeStatus2 = { icon: '', isCompleted: false };
let getCurrentNodeIdSpy: jasmine.Spy;
describe('StepToolsComponent', () => {
  let component: StepToolsComponent;
  let fixture: ComponentFixture<StepToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, StepToolsComponent, StudentTeacherCommonServicesModule],
      providers: [MockProvider(StudentService), provideHttpClient(withInterceptorsFromDi())]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepToolsComponent);
    getCurrentNodeIdSpy = spyOn(TestBed.inject(StudentDataService), 'getCurrentNodeId');
    getCurrentNodeIdSpy.and.returnValue(nodeId1);
    spyOn(TestBed.inject(NodeStatusService), 'getNodeStatuses').and.returnValue({
      node1: nodeStatus1,
      node2: nodeStatus2
    });
    spyOn(TestBed.inject(NodeStatusService), 'getNodeStatusByNodeId').and.returnValue({
      isCompleted: true
    });
    const projectService = TestBed.inject(VLEProjectService);
    spyOn(projectService, 'nodeHasWork').and.returnValue(true);
    spyOn(projectService, 'getNodesByToNodeId').and.returnValue([]);
    spyOn(TestBed.inject(StudentDataService), 'getRunStatus').and.returnValue({
      runId: '1',
      periods: []
    });
    spyOn(TestBed.inject(StudentService), 'getRunInfoById').and.returnValue(
      of({ isSurvey: false } as RunInfo)
    );
    component = fixture.componentInstance;
    component.notebookConfig = {
      itemTypes: {
        note: {
          enabled: true,
          label: {
            link: 'note'
          }
        }
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
