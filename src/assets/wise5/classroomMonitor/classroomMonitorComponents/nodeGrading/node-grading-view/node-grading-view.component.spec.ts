import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { ComponentSelectComponent } from '../../../../../../app/classroom-monitor/component-select/component-select.component';
import { WorkgroupSelectAutocompleteComponent } from '../../../../../../app/classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { VLEProjectService } from '../../../../vle/vleProjectService';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { NodeGradingViewComponent } from './node-grading-view.component';
import { ConfigService } from '../../../../services/configService';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { NodeGradingViewComponentTestHelper } from '../../nodeGrading/node-grading-view/node-grading-view.component.test.helper';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

let component: NodeGradingViewComponent;
let fixture: ComponentFixture<NodeGradingViewComponent>;
let testHelper: NodeGradingViewComponentTestHelper;

describe('NodeGradingViewComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ComponentSelectComponent,
        NodeGradingViewComponent,
        WorkgroupSelectAutocompleteComponent
      ],
      imports: [
        BrowserAnimationsModule,
        ClassroomMonitorTestingModule,
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatListModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeGradingViewComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(ConfigService), 'getClassmateUserInfos').and.returnValue([]);
    spyOn(TestBed.inject(ConfigService), 'getPermissions').and.returnValue({
      canViewStudentNames: true,
      canGradeStudentWork: true,
      canAuthorProject: true
    });
    spyOn(TestBed.inject(TeacherProjectService), 'getMaxScoreForNode').and.returnValue(5);
    spyOn(TestBed.inject(TeacherProjectService), 'nodeHasWork').and.returnValue(true);
    spyOn(TestBed.inject(VLEProjectService), 'getAchievements').and.returnValue({});
    spyOn(TestBed.inject(TeacherDataService), 'retrieveStudentDataForNode').and.returnValue(of([]));
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentPeriodId').and.returnValue(1);
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentPeriod').and.returnValue({ periodId: 1 });
    testHelper = new NodeGradingViewComponentTestHelper();
    initializeWorkgroups(component);
    fixture.detectChanges();
  });

  setSort();
});

function initializeWorkgroups(component: NodeGradingViewComponent) {
  component.workgroups = [
    createWorkgroupForTesting(
      testHelper.statusCompleted,
      testHelper.visible,
      1,
      testHelper.workgroupId1
    ),
    createWorkgroupForTesting(
      testHelper.statusNoWork,
      testHelper.visible,
      3,
      testHelper.workgroupId2
    ),
    createWorkgroupForTesting(
      testHelper.statusPartiallyCompleted,
      testHelper.visible,
      5,
      testHelper.workgroupId3
    ),
    createWorkgroupForTesting(
      testHelper.statusCompleted,
      testHelper.visible,
      3,
      testHelper.workgroupId4
    ),
    createWorkgroupForTesting(
      testHelper.statusNoWork,
      testHelper.notVisible,
      null,
      testHelper.workgroupId5
    )
  ];
}

function setSort() {
  it('should sort by workgroup id ascending', () => {
    component.setSort('team');
    component.setSort('team');
    testHelper.expectWorkgroupOrder(component.sortedWorkgroups, [
      testHelper.workgroupId1,
      testHelper.workgroupId2,
      testHelper.workgroupId3,
      testHelper.workgroupId4,
      testHelper.workgroupId5
    ]);
  });
  it('should sort by workgroup id descending', () => {
    component.setSort('team');
    testHelper.expectWorkgroupOrder(component.sortedWorkgroups, [
      testHelper.workgroupId4,
      testHelper.workgroupId3,
      testHelper.workgroupId2,
      testHelper.workgroupId1,
      testHelper.workgroupId5
    ]);
  });
  it('should sort by completion status ascending', () => {
    component.setSort('status');
    testHelper.expectWorkgroupOrder(component.sortedWorkgroups, [
      testHelper.workgroupId2,
      testHelper.workgroupId3,
      testHelper.workgroupId1,
      testHelper.workgroupId4,
      testHelper.workgroupId5
    ]);
  });
  it('should sort by completion status descending', () => {
    component.setSort('status');
    component.setSort('status');
    testHelper.expectWorkgroupOrder(component.sortedWorkgroups, [
      testHelper.workgroupId1,
      testHelper.workgroupId4,
      testHelper.workgroupId3,
      testHelper.workgroupId2,
      testHelper.workgroupId5
    ]);
  });
  it('should sort by score ascending', () => {
    component.setSort('score');
    testHelper.expectWorkgroupOrder(component.sortedWorkgroups, [
      testHelper.workgroupId1,
      testHelper.workgroupId2,
      testHelper.workgroupId4,
      testHelper.workgroupId3,
      testHelper.workgroupId5
    ]);
  });
  it('should sort by score descending', () => {
    component.setSort('score');
    component.setSort('score');
    testHelper.expectWorkgroupOrder(component.sortedWorkgroups, [
      testHelper.workgroupId3,
      testHelper.workgroupId2,
      testHelper.workgroupId4,
      testHelper.workgroupId1,
      testHelper.workgroupId5
    ]);
  });
}

function createWorkgroupForTesting(
  completionStatus: number,
  isVisible: number,
  score: number,
  workgroupId: number
): any {
  return {
    completionStatus: completionStatus,
    isVisible: isVisible,
    score: score,
    workgroupId: workgroupId
  };
}
