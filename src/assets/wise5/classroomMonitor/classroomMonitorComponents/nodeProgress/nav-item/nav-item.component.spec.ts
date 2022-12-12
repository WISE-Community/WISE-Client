import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { NotificationService } from '../../../../services/notificationService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { NavItemComponent } from './nav-item.component';

class MockNotificationService {
  getAlertNotifications() {
    return [];
  }
}

class MockTeacherDataService {
  currentNode = {};
  private currentNodeChangedSource: Subject<any> = new Subject<any>();
  public currentNodeChanged$ = this.currentNodeChangedSource.asObservable();
  private currentPeriodChangedSource: Subject<any> = new Subject<any>();
  public currentPeriodChanged$: Observable<any> = this.currentPeriodChangedSource.asObservable();

  endCurrentNodeAndSetCurrentNodeByNodeId() {}
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
  getNode() {
    return { getIcon: () => {} };
  }
  getParentGroup() {}
  getNumberOfRubricsByNodeId() {}
}

let component: NavItemComponent;
let fixture: ComponentFixture<NavItemComponent>;
const nodeId = 'node1';
const periodId = 1;

describe('NavItemComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavItemComponent],
      imports: [ClassroomMonitorTestingModule, MatSnackBarModule],
      providers: [
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
});

function itemClicked() {
  describe('itemClicked', () => {
    it('should set expanded to false when itemClicked() is called on an expanded group', () => {
      component.isGroup = true;
      component.expanded = true;
      component.itemClicked();
      expect(component.expanded).toBeFalse();
    });

    it('should set expanded to true when itemClicked() is called on a collapsed group', () => {
      component.isGroup = true;
      component.expanded = false;
      component.itemClicked();
      expect(component.expanded).toBeTrue();
    });

    it('should set current node when a step is clicked', () => {
      const endCurrentNodeAndSetCurrentNodeByNodeIdSpy = spyOn(
        TestBed.inject(TeacherDataService),
        'endCurrentNodeAndSetCurrentNodeByNodeId'
      );
      component.isGroup = false;
      component.itemClicked();
      expect(endCurrentNodeAndSetCurrentNodeByNodeIdSpy).toHaveBeenCalled();
    });
  });
}
