import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeGradingComponent } from './node-grading.component';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { MockComponents, MockProviders } from 'ng-mocks';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { Node } from '../../../../common/Node';
import { Observable, Subject } from 'rxjs';
import { WorkgroupService } from '../../../../../../app/services/workgroup.service';
import { FilterComponentsComponent } from '../filter-components/filter-components.component';
import { ComponentTypeService } from '../../../../services/componentTypeService';
import { ComponentSummaryComponent } from '../../component-summary/component-summary.component';
import { NodeClassResponsesComponent } from '../node-class-responses/node-class-responses.component';
import { AnnotationService } from '../../../../services/annotationService';
import { Annotation } from '../../../../common/Annotation';
import { BranchService } from '../../../../services/branchService';
import { ComponentServiceLookupService } from '../../../../services/componentServiceLookupService';
import { provideHttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../services/configService';
import { PathService } from '../../../../services/pathService';

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

class MockAnnotationService {
  private annotationReceivedSource: Subject<Annotation> = new Subject<Annotation>();
  public readonly annotationReceived$: Observable<Annotation> =
    this.annotationReceivedSource.asObservable();
  broadcastAnnotationReceived(annotation: Annotation): void {
    this.annotationReceivedSource.next(annotation);
  }
}

class MockProjectService {
  private projectSavedSource: Subject<any> = new Subject<any>();
  public readonly projectSaved$: Observable<any> = this.projectSavedSource.asObservable();
  broadcastProjectSaved() {
    this.projectSavedSource.next({});
  }
  nodeHasWork(): boolean {
    return false;
  }
  getNode(): Node {
    return null;
  }
  getComponents(): any[] {
    return [];
  }
  componentHasWork(): boolean {
    return false;
  }
}

describe('NodeGradingComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponents(
          ComponentSummaryComponent,
          FilterComponentsComponent,
          NodeClassResponsesComponent
        )
      ],
      imports: [NodeGradingComponent],
      providers: [
        { provide: AnnotationService, useClass: MockAnnotationService },
        { provide: TeacherProjectService, MockProjectService },
        MockProviders(
          BranchService,
          ClassroomStatusService,
          ComponentServiceLookupService,
          ComponentTypeService,
          ConfigService,
          PathService,
          WorkgroupService
        ),
        { provide: TeacherDataService, useClass: MockDataService },
        provideHttpClient()
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
    spyOn(projectService, 'getMaxScoreForNode').and.returnValue(5);
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

  annotationReceived_RecalculateNodeCompletion();
  periodChanged_RecalculateNodeCompletion();
  projectSaved_RecalculateNodeCompletion();
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

function annotationReceived_RecalculateNodeCompletion() {
  describe('annotation received', () => {
    it('recalculates node completion', () => {
      nodeCompletionSpy.calls.reset();
      const annotationService = TestBed.inject(AnnotationService);
      annotationService.broadcastAnnotationReceived({} as Annotation);
      expect(nodeCompletionSpy).toHaveBeenCalledTimes(1);
    });
  });
}

function projectSaved_RecalculateNodeCompletion() {
  describe('project saved', () => {
    it('recalculates node completion', () => {
      nodeCompletionSpy.calls.reset();
      const projectService = TestBed.inject(TeacherProjectService);
      projectService.broadcastProjectSaved();
      expect(nodeCompletionSpy).toHaveBeenCalledTimes(1);
    });
  });
}
