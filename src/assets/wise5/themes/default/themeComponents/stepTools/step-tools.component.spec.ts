import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectService } from '../../../../services/projectService';
import { StudentDataService } from '../../../../services/studentDataService';
import { StepToolsComponent } from './step-tools.component';
import { StudentTeacherCommonServicesModule } from '../../../../../../app/student-teacher-common-services.module';
import { NodeStatusService } from '../../../../services/nodeStatusService';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

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
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
    spyOn(TestBed.inject(ProjectService), 'nodeHasWork').and.returnValue(true);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
