import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { WorkgroupSelectAutocompleteComponent } from '../../../../../../app/classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { MilestoneGradingViewComponent } from './milestone-grading-view.component';
import { NodeGradingViewComponentTestHelper } from '../../nodeGrading/node-grading-view/node-grading-view.component.test.helper';

let component: MilestoneGradingViewComponent;
let fixture: ComponentFixture<MilestoneGradingViewComponent>;
let testHelper: NodeGradingViewComponentTestHelper;

describe('MilestoneGradingViewComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MilestoneGradingViewComponent, WorkgroupSelectAutocompleteComponent],
      imports: [
        ClassroomMonitorTestingModule,
        FormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        ReactiveFormsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MilestoneGradingViewComponent);
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
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentPeriodId').and.returnValue(1);
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentPeriod').and.returnValue({ periodId: 1 });
    spyOn(TestBed.inject(ConfigService), 'getClassmateUserInfos').and.returnValue([]);
    spyOn(TestBed.inject(TeacherDataService), 'retrieveStudentDataForNode').and.returnValue(
      Promise.resolve([])
    );
    testHelper = new NodeGradingViewComponentTestHelper();
    initializeWorkgroups(component);
    fixture.detectChanges();
  });

  setSort();
});

function initializeWorkgroups(component: MilestoneGradingViewComponent) {
  component.workgroups = [
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
      testHelper.notVisible,
      null,
      testHelper.workgroupId5
    )
  ];
}

function setSort() {
  it('should sort by initial score ascending', () => {
    component.setSort('initialScore');
    testHelper.expectWorkgroupOrder(component.sortedWorkgroups, [
      testHelper.workgroupId1,
      testHelper.workgroupId2,
      testHelper.workgroupId4,
      testHelper.workgroupId3,
      testHelper.workgroupId5
    ]);
  });
  it('should sort by initial score descending', () => {
    component.setSort('-initialScore');
    testHelper.expectWorkgroupOrder(component.sortedWorkgroups, [
      testHelper.workgroupId3,
      testHelper.workgroupId2,
      testHelper.workgroupId4,
      testHelper.workgroupId1,
      testHelper.workgroupId5
    ]);
  });
  it('should sort by change in score ascending', () => {
    component.setSort('changeInScore');
    testHelper.expectWorkgroupOrder(component.sortedWorkgroups, [
      testHelper.workgroupId4,
      testHelper.workgroupId2,
      testHelper.workgroupId3,
      testHelper.workgroupId1,
      testHelper.workgroupId5
    ]);
  });
  it('should sort by change in score descending', () => {
    component.setSort('-changeInScore');
    testHelper.expectWorkgroupOrder(component.sortedWorkgroups, [
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
