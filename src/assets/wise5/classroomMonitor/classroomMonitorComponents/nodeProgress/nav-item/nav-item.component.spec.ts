import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, Subject } from 'rxjs';
import { NotificationService } from '../../../../services/notificationService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { NavItemComponent } from './nav-item.component';
import { NodeService } from '../../../../services/nodeService';
import { Node } from '../../../../common/Node';
import { MockComponent } from 'ng-mocks';
import { TeamsOnNodeComponent } from '../../../../../../app/classroom-monitor/teams-on-node/teams-on-node.component';

class MockNotificationService {
  getAlertNotifications() {
    return [];
  }
}

class MockNodeService {
  setCurrentNode(): void {}
}

class MockTeacherDataService {
  currentNode = {};
  private currentNodeChangedSource: Subject<any> = new Subject<any>();
  public currentNodeChanged$ = this.currentNodeChangedSource.asObservable();
  private currentPeriodChangedSource: Subject<any> = new Subject<any>();
  public currentPeriodChanged$: Observable<any> = this.currentPeriodChangedSource.asObservable();

  getCurrentPeriod() {
    return { periodId: periodId };
  }
  getCurrentWorkgroup() {}
}

class MockTeacherProjectService {
  idToNode = { node1: {} };
  nodeIdToNumber = {};

  isGroupNode() {}
  nodeHasWork() {}
  getMaxScoreForNode() {}
  getNodeById() {
    return { constraints: [] };
  }
  getNode() {
    return new Node();
  }
  getParentGroup() {}
  saveProject() {}
}

let component: NavItemComponent;
let fixture: ComponentFixture<NavItemComponent>;
const nodeId = 'node1';
const periodId = 1;
let node1;

describe('NavItemComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ClassroomMonitorTestingModule,
        NavItemComponent,
        MockComponent(TeamsOnNodeComponent)
      ],
      providers: [
        { provide: NodeService, useClass: MockNodeService },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: TeacherDataService, useClass: MockTeacherDataService },
        { provide: TeacherProjectService, useClass: MockTeacherProjectService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavItemComponent);
    component = fixture.componentInstance;
    component.nodeId = nodeId;
    fixture.detectChanges();
  });

  itemClicked();
  toggleLockNode();
  importantTag();
});

function importantTag() {
  describe('important tag', () => {
    let projectService: TeacherProjectService;
    beforeEach(() => {
      projectService = TestBed.inject(TeacherProjectService);
    });

    it('shows bookmark icon when node contains a component with !important tag', () => {
      const node = new Node();
      spyOn(node, 'getComponents').and.returnValue([{ id: 'comp1', tags: ['!important'] }] as any);
      spyOn(projectService, 'getNode').and.returnValue(node);
      spyOn(projectService, 'nodeHasWork').and.returnValue(true);

      component.type = 'list';
      component.ngOnInit();
      fixture.detectChanges();

      const icons = Array.from(fixture.nativeElement.querySelectorAll('mat-icon'));
      const starIcon = icons.find((icon: any) => icon.textContent.trim() === 'bookmark');
      expect(starIcon).toBeTruthy();
      expect(component['hasImportantComponent']).toBeTrue();
    });

    it('does not show bookmark icon when node does not contain a component with !important tag', () => {
      const node = new Node();
      spyOn(node, 'getComponents').and.returnValue([{ id: 'comp1', tags: ['other'] }] as any);
      spyOn(projectService, 'getNode').and.returnValue(node);
      spyOn(projectService, 'nodeHasWork').and.returnValue(true);

      component.type = 'list';
      component.ngOnInit();
      fixture.detectChanges();

      const icons = Array.from(fixture.nativeElement.querySelectorAll('mat-icon'));
      const starIcon = icons.find((icon: any) => icon.textContent.trim() === 'bookmark');
      expect(starIcon).toBeFalsy();
      expect(component['hasImportantComponent']).toBeFalse();
    });
  });
}

function itemClicked() {
  describe('itemClicked', () => {
    it('should set expanded to false when itemClicked() is called on an expanded group', () => {
      component['isGroup'] = true;
      component['expanded'] = true;
      component.itemClicked();
      expect(component['expanded']).toBeFalse();
    });

    it('should set expanded to true when itemClicked() is called on a collapsed group', () => {
      component['isGroup'] = true;
      component['expanded'] = false;
      component.itemClicked();
      expect(component['expanded']).toBeTrue();
    });

    it('should set current node when a step is clicked', () => {
      const spy = spyOn(TestBed.inject(NodeService), 'setCurrentNode');
      component['isGroup'] = false;
      component.itemClicked();
      expect(spy).toHaveBeenCalled();
    });
  });
}

function toggleLockNode() {
  describe('toggleLockNode()', () => {
    let projectService: TeacherProjectService;
    let lockNodeButton;
    let saveSpy;
    beforeEach(() => {
      node1 = new Node();
      node1.id = nodeId;
      component['isGroup'] = true;
      component.type = 'card';
      fixture.detectChanges();
      projectService = TestBed.inject(TeacherProjectService);
      saveSpy = spyOn(projectService, 'saveProject').and.returnValue(new Promise(() => {}));
      lockNodeButton = fixture.debugElement.nativeElement.querySelector('button');
    });
    describe('when there is no teacherRemovalConstraint', () => {
      it('should add constraint', () => {
        const getNodeSpy = spyOn(projectService, 'getNodeById').and.returnValue(node1);
        expect(node1.constraints.length).toEqual(0);
        lockNodeButton.click();
        expect(getNodeSpy).toHaveBeenCalled();
        expect(saveSpy).toHaveBeenCalled();
        expect(node1.constraints.length).toEqual(1);
        expect(node1.constraints[0].action).toEqual('makeThisNodeNotVisitable');
      });
    });
    describe('when there is teacherRemovalConstraint', () => {
      it('should remove constraint', () => {
        node1.addConstraint({
          id: 'ksav10btkr',
          action: 'makeThisNodeNotVisitable',
          targetId: nodeId,
          removalConditional: 'any',
          removalCriteria: [
            Object({ name: 'teacherRemoval', params: Object({ periodId: periodId }) })
          ]
        });
        const getNodeSpy = spyOn(projectService, 'getNodeById').and.returnValue(node1);
        const dataService = TestBed.inject(TeacherDataService);
        const currentPeriodSpy = spyOn(dataService, 'getCurrentPeriod').and.returnValue({
          periodId: periodId
        });
        lockNodeButton.click();
        expect(getNodeSpy).toHaveBeenCalled();
        expect(saveSpy).toHaveBeenCalled();
        expect(currentPeriodSpy).toHaveBeenCalled();
        expect(node1.constraints.length).toEqual(0);
      });
    });
  });
}
