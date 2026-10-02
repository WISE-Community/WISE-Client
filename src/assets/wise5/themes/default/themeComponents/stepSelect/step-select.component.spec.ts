import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { NodeService } from '../../../../services/nodeService';
import { NodeStatusService } from '../../../../services/nodeStatusService';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { StepSelectComponent } from './step-select.component';
import { StudentDataService } from '../../../../services/studentDataService';
import { StudentService } from '../../../../../../app/student/student.service';
import { StudentTeacherCommonServicesModule } from '../../../../../../app/student-teacher-common-services.module';
import { VLEProjectService } from '../../../../vle/vleProjectService';
import { of } from 'rxjs';
import { RunInfo } from '../../../../../../app/student/run-info';

const nodeId1 = 'node1';
const nodeStatus1 = {
  icon: '',
  isCompleted: true,
  progress: { completionPct: 100, completedItems: 1, totalItems: 1 }
};
const nodeStatus2 = {
  icon: '',
  isCompleted: false,
  progress: { completionPct: 0, completedItems: 0, totalItems: 1 }
};
let getCurrentNodeIdSpy: jasmine.Spy;

describe('StepSelectComponent', () => {
  let component: StepSelectComponent;
  let fixture: ComponentFixture<StepSelectComponent>;
  let projectService: VLEProjectService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, StepSelectComponent, StudentTeacherCommonServicesModule],
      providers: [MockProvider(StudentService), provideHttpClient(withInterceptorsFromDi())]
    }).compileComponents();
  });

  beforeEach(() => {
    projectService = TestBed.inject(VLEProjectService);
    projectService.idToOrder = {
      group0: { order: 0 },
      group1: { order: 1 },
      node1: { order: 2 }
    };
    spyOn(projectService, 'nodeHasWork').and.returnValue(true);
    spyOn(projectService, 'getNodesByToNodeId').and.returnValue([]);
    spyOn(projectService, 'isGroupNode').and.callFake((id: string) => id.startsWith('group'));
    spyOn(projectService, 'getNodePositionAndTitle').and.callFake((id: string) => `Title ${id}`);
    spyOn(projectService, 'getChildNodeIdsById').and.callFake((id: string) =>
      id === 'group1' ? ['node1'] : []
    );
    spyOn(projectService, 'getParentGroupId').and.returnValue('group1');

    getCurrentNodeIdSpy = spyOn(TestBed.inject(StudentDataService), 'getCurrentNodeId');
    getCurrentNodeIdSpy.and.returnValue(nodeId1);
    spyOn(TestBed.inject(NodeStatusService), 'getNodeStatuses').and.returnValue({
      group0: { isVisible: true, isVisitable: true, progress: { completionPct: 50 } },
      group1: {
        isVisible: true,
        isVisitable: true,
        progress: { completionPct: 50, completedItems: 1, totalItems: 2 }
      },
      node1: nodeStatus1,
      node2: nodeStatus2
    });
    spyOn(TestBed.inject(NodeStatusService), 'getNodeStatusByNodeId').and.returnValue({
      isCompleted: true
    });
    spyOn(TestBed.inject(StudentDataService), 'getRunStatus').and.returnValue({
      runId: '1',
      periods: []
    });
    spyOn(TestBed.inject(StudentService), 'getRunInfoById').and.returnValue(
      of({ isSurvey: false } as RunInfo)
    );

    fixture = TestBed.createComponent(StepSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and populate groups', () => {
    expect(component).toBeTruthy();
    expect((component as any).groups.length).toBe(1);
    expect((component as any).groups[0].id).toBe('group1');
    expect((component as any).groups[0].title).toBe('Title group1');
    expect((component as any).groups[0].children.length).toBe(1);
    expect((component as any).groups[0].children[0].id).toBe('node1');
    expect((component as any).currentNodeTitle).toBe('Title node1');
  });

  it('should expand current group and focus and scroll to active step when menu opens', fakeAsync(() => {
    spyOn(component as any, 'setExpandedGroup');
    const mockButton = document.createElement('button');
    spyOn(mockButton, 'focus');
    spyOn(mockButton, 'scrollIntoView');
    spyOn(document, 'querySelector').and.returnValue(mockButton);

    (component as any).onMenuOpened();
    expect((component as any).setExpandedGroup).toHaveBeenCalled();

    tick();
    expect(document.querySelector).toHaveBeenCalledWith('.mdc-list-item--activated');
    expect(mockButton.focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(mockButton.scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });
  }));

  it('should navigate to selected node when chooseNode is called', () => {
    const nodeService = TestBed.inject(NodeService);
    spyOn(nodeService, 'setCurrentNode');
    (component as any).chooseNode('node1');
    expect(nodeService.setCurrentNode).toHaveBeenCalledWith('node1');
  });

  it('should format progress tooltip correctly', () => {
    const tooltip = (component as any).getProgressTooltip('group1');
    expect(tooltip).toBe('50% completed (1/2)');
  });
});
