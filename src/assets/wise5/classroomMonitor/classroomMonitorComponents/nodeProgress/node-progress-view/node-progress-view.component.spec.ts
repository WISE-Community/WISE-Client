import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { UpgradeModule } from '@angular/upgrade/static';
import { Observable, Subject } from 'rxjs';
import { ComponentSelectComponent } from '../../../../../../app/classroom-monitor/component-select/component-select.component';
import { DialogWithOpenInNewWindowComponent } from '../../../../directives/dialog-with-open-in-new-window/dialog-with-open-in-new-window.component';
import { MilestoneService } from '../../../../services/milestoneService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherPeerGroupService } from '../../../../services/teacherPeerGroupService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { NodeGradingViewComponent } from '../../nodeGrading/node-grading-view/node-grading-view.component';
import { NodeProgressViewComponent } from './node-progress-view.component';

const rubric = 'This is the unit rubric.';
const title = 'Photosynthesis';

class MockMilestoneService {
  getMilestoneReportByNodeId() {
    return {};
  }
}

class MockPeerGroupService {
  getPeerGroupingTags() {
    return new Set<string>();
  }
}

class MockTeacherProjectService {
  private projectSavedSource: Subject<any> = new Subject<any>();
  public projectSaved$: Observable<any> = this.projectSavedSource.asObservable();
  idToOrder = {};
  rootNode = { id: 'group0' };
  getMaxScore() {
    return 5;
  }
  getMaxScoreForNode() {
    return 5;
  }
  getStartNodeId() {
    return 'group0';
  }
  getProjectRubric() {
    return '';
  }
  getNode() {
    return {};
  }
  getNodeById() {
    return {};
  }
  getRootNode() {
    return { id: 'group0' };
  }
  isApplicationNode() {
    return true;
  }
  isGroupNode() {
    return false;
  }
  nodeHasWork() {
    return true;
  }
  getComponents() {
    return [];
  }
  replaceAssetPaths(): string {
    return rubric;
  }
  getProjectTitle(): string {
    return title;
  }
}

class MockTeacherDataService {
  private currentNodeChangedSource: Subject<any> = new Subject<any>();
  public currentNodeChanged$ = this.currentNodeChangedSource.asObservable();
  private currentWorkgroupChangedSource: Subject<any> = new Subject<any>();
  public currentWorkgroupChanged$: Observable<any> = this.currentWorkgroupChangedSource.asObservable();
  private studentWorkReceivedSource: Subject<any> = new Subject<any>();
  public studentWorkReceived$ = this.studentWorkReceivedSource.asObservable();
  private currentPeriodChangedSource: Subject<any> = new Subject<any>();
  public currentPeriodChanged$: Observable<any> = this.currentPeriodChangedSource.asObservable();
  setCurrentNodeByNodeId() {}
  retrieveStudentDataForNode() {
    return Promise.resolve({});
  }
  getCurrentPeriodId() {}
}

class MockUpgradeModule {
  $injector: any = {
    get() {
      return { go: () => {}, onSuccess: () => {} };
    }
  };
}

describe('NodeProgressViewComponent', () => {
  let component: NodeProgressViewComponent;
  let fixture: ComponentFixture<NodeProgressViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComponentSelectComponent, NodeGradingViewComponent, NodeProgressViewComponent],
      imports: [ClassroomMonitorTestingModule, FlexLayoutModule, MatIconModule, MatListModule],
      providers: [
        {
          provide: MilestoneService,
          useClass: MockMilestoneService
        },
        {
          provide: TeacherPeerGroupService,
          useClass: MockPeerGroupService
        },
        {
          provide: TeacherDataService,
          useClass: MockTeacherDataService
        },
        {
          provide: TeacherProjectService,
          useClass: MockTeacherProjectService
        },
        {
          provide: UpgradeModule,
          useClass: MockUpgradeModule
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeProgressViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should open the rubric dialog', () => {
    const dialogOpenSpy = spyOn(TestBed.inject(MatDialog), 'open');
    component.showRubric();
    expect(dialogOpenSpy).toHaveBeenCalledWith(DialogWithOpenInNewWindowComponent, {
      data: {
        content: rubric,
        scroll: true,
        title: title
      },
      panelClass: 'dialog-lg'
    });
  });

  it('should expand a group', () => {
    expect(component).toBeTruthy();
    component.nodeIdToExpanded = {
      group1: true,
      group2: false,
      group3: false
    };
    component.childExpandedEvent({ nodeId: 'group2', expanded: true });
    expect(component.nodeIdToExpanded['group1']).toEqual(false);
    expect(component.nodeIdToExpanded['group2']).toEqual(true);
    expect(component.nodeIdToExpanded['group3']).toEqual(false);
  });
});
