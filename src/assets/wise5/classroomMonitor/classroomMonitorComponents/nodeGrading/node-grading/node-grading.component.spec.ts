import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeGradingComponent } from './node-grading.component';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { MockComponents, MockProvider, MockProviders } from 'ng-mocks';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { Node } from '../../../../common/Node';
import { Observable, of, Subject } from 'rxjs';
import { WorkgroupService } from '../../../../../../app/services/workgroup.service';
import { FilterComponentsComponent } from '../filter-components/filter-components.component';
import { ComponentTypeService } from '../../../../services/componentTypeService';
import { ComponentGradingViewComponent } from '../../component-grading-view/component-grading-view.component';
import { NodeClassResponsesComponent } from '../node-class-responses/node-class-responses.component';
import { AnnotationService } from '../../../../services/annotationService';
import { Annotation } from '../../../../common/Annotation';

let classroomStatusService: ClassroomStatusService;
let component: NodeGradingComponent;
let dataService: TeacherDataService;
let fixture: ComponentFixture<NodeGradingComponent>;
let nodeCompletionSpy;

class MockDataService {
  private currentNodeChangedSource: Subject<any> = new Subject<any>();
  public currentNodeChanged$ = this.currentNodeChangedSource.asObservable();
  private currentPeriodChangedSource: Subject<any> = new Subject<any>();
  public currentPeriodChanged$: Observable<any> = this.currentPeriodChangedSource.asObservable();

  getCurrentPeriodId(): number {
    return 1;
  }

  setCurrentNodeByNodeId(): void {}

  setCurrentPeriod(period: any): void {
    this.currentPeriodChangedSource.next({
      previousPeriod: null,
      currentPeriod: period
    });
  }
}

describe('NodeGradingComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponents(
          ComponentGradingViewComponent,
          FilterComponentsComponent,
          NodeClassResponsesComponent
        )
      ],
      imports: [NodeGradingComponent],
      providers: [
        MockProvider(AnnotationService, {
          annotationReceived$: of({} as Annotation)
        }),
        MockProvider(TeacherProjectService, {
          projectSaved$: new Subject<any>().asObservable()
        }),
        MockProviders(ClassroomStatusService, ComponentTypeService, WorkgroupService),
        { provide: TeacherDataService, useClass: MockDataService }
      ]
    }).compileComponents();
    const projectService = TestBed.inject(TeacherProjectService);
    classroomStatusService = TestBed.inject(ClassroomStatusService);
    spyOn(projectService, 'nodeHasWork').and.returnValue(false);
    const node = new Node();
    node.components = [{ id: 'component1' }];
    spyOn(projectService, 'getNode').and.returnValue(node);
    spyOn(projectService, 'getComponents').and.returnValue([{ id: 'abc', type: 'MultipleChoice' }]);
    spyOn(projectService, 'componentHasWork').and.returnValue(true);
    dataService = TestBed.inject(TeacherDataService);
    spyOn(dataService, 'getCurrentPeriodId').and.returnValue(1);
    nodeCompletionSpy = spyOn(classroomStatusService, 'getNodeCompletion').and.returnValue({
      completionPct: 50
    });
    fixture = TestBed.createComponent(NodeGradingComponent);
    component = fixture.componentInstance;
    component.nodeId = 'node1';
    component.ngOnInit();
  });

  periodChanged_RecalculateNodeCompletion();
});

function periodChanged_RecalculateNodeCompletion() {
  describe('period changed', () => {
    it('recalculates node completion', () => {
      nodeCompletionSpy.calls.reset();
      dataService.setCurrentPeriod({ periodId: 1 });
      expect(nodeCompletionSpy).toHaveBeenCalledTimes(1);
    });
  });
}
