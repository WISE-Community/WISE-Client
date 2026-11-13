import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeClassResponsesComponent } from './node-class-responses.component';
import { AnnotationService } from '../../../../services/annotationService';
import { MockComponent, MockProvider, MockProviders } from 'ng-mocks';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { ComponentServiceLookupService } from '../../../../services/componentServiceLookupService';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { NotificationService } from '../../../../services/notificationService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { of, Subject } from 'rxjs';
import { Node } from '../../../../common/Node';
import { ComponentContent } from '../../../../common/ComponentContent';
import { WorkgroupSelectAutocompleteComponent } from '../../../../../../app/classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';
import { MatButtonHarness } from '@angular/material/button/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('NodeClassResponsesComponent', () => {
  let component: NodeClassResponsesComponent;
  let fixture: ComponentFixture<NodeClassResponsesComponent>;
  let loader: HarnessLoader;
  let studentStatusReceivedSource: Subject<any>;
  let studentWorkReceivedSource: Subject<any>;
  let configRetrievedSource: Subject<any>;

  beforeEach(async () => {
    configRetrievedSource = new Subject<any>();
    studentStatusReceivedSource = new Subject<any>();
    studentWorkReceivedSource = new Subject<any>();
    await TestBed.configureTestingModule({
      declarations: [MockComponent(WorkgroupSelectAutocompleteComponent)],
      imports: [NodeClassResponsesComponent],
      providers: [
        MockProviders(AnnotationService, ComponentServiceLookupService, NotificationService),
        MockProvider(ConfigService, {
          configRetrieved$: configRetrievedSource.asObservable()
        }),
        MockProvider(ClassroomStatusService, {
          studentStatusReceived$: studentStatusReceivedSource.asObservable()
        }),
        MockProvider(TeacherDataService, {
          studentWorkReceived$: studentWorkReceivedSource.asObservable()
        }),
        MockProvider(TeacherProjectService, {
          projectSaved$: of()
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NodeClassResponsesComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    component['sortedWorkgroups'] = [
      { workgroupId: 1, name: 'Workgroup 1' },
      { workgroupId: 2, name: 'Workgroup 2' }
    ];
    fixture.detectChanges();
  });

  it('clicking on the expand all button should expand all teams', async () => {
    expect(component['allWorkgroupsExpanded']).toBeFalsy();
    await (await loader.getHarness(MatButtonHarness.with({ text: '+ Expand all' }))).click();
    expect(component['allWorkgroupsExpanded']).toBeTrue();
  });

  describe('a new student status arrives while the step is open', () => {
    let status: any;
    beforeEach(() => {
      status = statusWithComponent1(false);
      component.node = { id: 'node1' } as Node;
      component.components = [{ id: 'component1', type: 'MultipleChoice' } as ComponentContent];
      const workgroup = { workgroupId: 1, name: 'Workgroup 1' };
      component['workgroups'] = [workgroup];
      component['sortedWorkgroups'] = [workgroup];
      component['workgroupsById'] = { 1: workgroup };
      component['studentDataLoaded'] = true;
      const classroomStatusService = TestBed.inject(ClassroomStatusService);
      spyOn(classroomStatusService, 'hasStudentStatus').and.returnValue(true);
      spyOn(classroomStatusService, 'getStudentStatusForWorkgroupId').and.callFake(() => status);
      spyOn(TestBed.inject(NotificationService), 'getAlertNotifications').and.returnValue([]);
      const dataService = TestBed.inject(TeacherDataService);
      spyOn(dataService, 'getComponentStatesByNodeId').and.returnValue([
        { workgroupId: 1, componentId: 'component1', serverSaveTime: 1000 }
      ]);
      spyOn(dataService, 'getAnnotationsByNodeId').and.returnValue([]);
      spyOn(TestBed.inject(TeacherProjectService), 'nodeHasWork').and.returnValue(true);
    });

    it('updates the row with a new object so the row recalculates its status', () => {
      const before = component['sortedWorkgroups'][0];
      studentStatusReceivedSource.next({ studentStatus: { workgroupId: 1 } });
      expect(component['sortedWorkgroups'][0].completionStatus).toEqual(1);
      status = statusWithComponent1(true);
      studentStatusReceivedSource.next({ studentStatus: { workgroupId: 1 } });
      const after = component['sortedWorkgroups'][0];
      expect(after.completionStatus).toEqual(2);
      expect(after).not.toBe(before);
      expect(component['workgroupsById'][1]).toBe(after);
    });

    it('ignores a status for a workgroup that is not in this run', () => {
      spyOn(TestBed.inject(ConfigService), 'getClassmateUserInfos').and.returnValue([]);
      studentStatusReceivedSource.next({ studentStatus: { workgroupId: 99 } });
      expect(component['sortedWorkgroups'].length).toEqual(1);
    });

    it('ignores a status that arrives before the step data has loaded', () => {
      component['studentDataLoaded'] = false;
      const before = component['sortedWorkgroups'][0];
      studentStatusReceivedSource.next({ studentStatus: { workgroupId: 1 } });
      expect(component['sortedWorkgroups'][0]).toBe(before);
    });

    it('adds a team that appears in the reloaded config', () => {
      const newWorkgroup = { workgroupId: 2, name: 'Workgroup 2' };
      spyOn(TestBed.inject(ConfigService), 'getClassmateUserInfos').and.returnValue([
        { workgroupId: 1, name: 'Workgroup 1' },
        newWorkgroup
      ]);
      configRetrievedSource.next({});
      expect(component['sortedWorkgroups'].map((w) => w.workgroupId)).toEqual([1, 2]);
      expect(component['workgroupsById'][2].workgroupId).toEqual(2);
    });

    it('shows a team as completed when its status says so but no work is cached locally', () => {
      const dataService = TestBed.inject(TeacherDataService);
      (dataService.getComponentStatesByNodeId as jasmine.Spy).and.returnValue([]);
      status = statusWithComponent1(true);
      const workgroup = { workgroupId: 1 };
      component['updateWorkgroup'](workgroup);
      expect(workgroup['completionStatus']).toEqual(2);
    });

    it('trusts a node status without component statuses that says completed', () => {
      status = statusWithComponent1(true);
      delete status.nodeStatuses.node1.componentStatuses;
      const workgroup = { workgroupId: 1 };
      component['updateWorkgroup'](workgroup);
      expect(workgroup['completionStatus']).toEqual(2);
    });
  });
});

function statusWithComponent1(isCompleted: boolean): any {
  return {
    workgroupId: 1,
    nodeStatuses: {
      node1: {
        isCompleted: isCompleted,
        isVisible: true,
        componentStatuses: { component1: { isCompleted: isCompleted, isVisible: true } }
      }
    }
  };
}
