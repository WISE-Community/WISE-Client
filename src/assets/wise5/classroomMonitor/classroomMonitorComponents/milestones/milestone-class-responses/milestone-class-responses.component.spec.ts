import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { MilestoneClassResponsesComponent } from './milestone-class-responses.component';
import { NodeGradingViewComponentTestHelper } from '../../nodeGrading/node-grading-view/node-grading-view.component.test.helper';
import { of } from 'rxjs';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';

let component: MilestoneClassResponsesComponent;
let fixture: ComponentFixture<MilestoneClassResponsesComponent>;
let testHelper: NodeGradingViewComponentTestHelper;
describe('MilestoneClassResponsesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomMonitorTestingModule, MilestoneClassResponsesComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MilestoneClassResponsesComponent);
    component = fixture.componentInstance;
    component.milestone = {
      nodeId: 'node1',
      report: {
        locations: []
      }
    };
    spyOn(TestBed.inject(ConfigService), 'getPermissions').and.returnValue({
      canViewStudentNames: true,
      canGradeStudentWork: true,
      canAuthorProject: true
    });
    testHelper = new NodeGradingViewComponentTestHelper();
    initializeWorkgroups(component);
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentPeriodId').and.returnValue(1);
    spyOn(TestBed.inject(TeacherDataService), 'isWorkgroupShown').and.returnValue(false);
    spyOn(TestBed.inject(ClassroomStatusService), 'hasStudentStatus').and.returnValue(true);
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentPeriod').and.returnValue({ periodId: 1 });
    spyOn(TestBed.inject(ConfigService), 'getClassmateUserInfos').and.returnValue(
      component['workgroups']
    );
    spyOn(TestBed.inject(TeacherDataService), 'retrieveStudentDataForNode').and.returnValue(of([]));
    fixture.detectChanges();
  });

  sortByTeam();
});

function initializeWorkgroups(component: MilestoneClassResponsesComponent) {
  component['workgroups'] = [
    createWorkgroupForTesting(
      3,
      testHelper.statusCompleted,
      1,
      testHelper.visible,
      4,
      testHelper.workgroupId1
    ),
    createWorkgroupForTesting(
      1,
      testHelper.statusNoWork,
      3,
      testHelper.visible,
      4,
      testHelper.workgroupId2
    ),
    createWorkgroupForTesting(
      1,
      testHelper.statusPartiallyCompleted,
      4,
      testHelper.visible,
      5,
      testHelper.workgroupId3
    ),
    createWorkgroupForTesting(
      -1,
      testHelper.statusCompleted,
      3,
      testHelper.visible,
      2,
      testHelper.workgroupId4
    ),
    createWorkgroupForTesting(
      null,
      testHelper.statusNoWork,
      null,
      testHelper.visible,
      null,
      testHelper.workgroupId5
    )
  ];
}

function sortByTeam() {
  it('should sort by team', () => {
    testHelper.expectWorkgroupOrder(component['sortedWorkgroups'], [
      testHelper.workgroupId1,
      testHelper.workgroupId2,
      testHelper.workgroupId3,
      testHelper.workgroupId4,
      testHelper.workgroupId5
    ]);
  });
}

function createWorkgroupForTesting(
  changeInScore: number,
  completionStatus: number,
  initialScore: number,
  isVisible: number,
  score: number,
  workgroupId: number
): any {
  return {
    changeInScore: changeInScore,
    completionStatus: completionStatus,
    initialScore: initialScore,
    isVisible: isVisible,
    score: score,
    workgroupId: workgroupId
  };
}
