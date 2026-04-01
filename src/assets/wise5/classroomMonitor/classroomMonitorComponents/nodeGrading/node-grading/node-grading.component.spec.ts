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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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
      imports: [NodeGradingComponent, NoopAnimationsModule],
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
  componentTags_importantTag();
});

function componentTags_importantTag() {
  describe('component tags', () => {
    it('shows a bookmark icon in the tab if the component has the !important tag', async () => {
      const projectService = TestBed.inject(TeacherProjectService);
      (projectService.getComponents as jasmine.Spy).and.returnValue([
        { id: 'component1', type: 'MultipleChoice', tags: ['!important'] }
      ]);

      component['setFields']();
      component['summariesVisible'] = true;
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const icons = Array.from(fixture.nativeElement.querySelectorAll('mat-icon'));
      let starIcon = icons.find((icon: any) => icon.textContent.trim() === 'bookmark');
      if (!starIcon) {
        starIcon = Array.from(document.querySelectorAll('mat-icon')).find(
          (icon: any) => (icon as Element).textContent.trim() === 'bookmark'
        ) as any;
      }
      expect(starIcon).toBeTruthy();
    });

    it('does not show a bookmark icon in the tab if the component does not have the !important tag', async () => {
      const projectService = TestBed.inject(TeacherProjectService);
      (projectService.getComponents as jasmine.Spy).and.returnValue([
        { id: 'component1', type: 'MultipleChoice', tags: ['other'] }
      ]);

      component['setFields']();
      component['summariesVisible'] = true;
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const icons = Array.from(fixture.nativeElement.querySelectorAll('mat-icon'));
      let starIcon = icons.find((icon: any) => icon.textContent.trim() === 'bookmark');
      if (!starIcon) {
        starIcon = Array.from(document.querySelectorAll('mat-icon')).find(
          (icon: any) => (icon as Element).textContent.trim() === 'bookmark'
        ) as any;
      }
      expect(starIcon).toBeFalsy();
    });
  });
}

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
