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

let component: NodeGradingViewComponent;
let fixture: ComponentFixture<NodeGradingViewComponent>;
const workgroupId1: number = 1;
const workgroupId2: number = 2;
const workgroupId3: number = 3;
const workgroupId4: number = 4;
const workgroupId5: number = 5;
const statusNoWork = 0;
const statusPartiallyCompleted = 1;
const statusCompleted = 2;
const notVisible = 0;
const visible = 1;
const workgroups = [
  createWorkgroupForTesting(statusCompleted, visible, 1, workgroupId1),
  createWorkgroupForTesting(statusNoWork, visible, 3, workgroupId2),
  createWorkgroupForTesting(statusPartiallyCompleted, visible, 5, workgroupId3),
  createWorkgroupForTesting(statusCompleted, visible, 3, workgroupId4),
  createWorkgroupForTesting(statusNoWork, notVisible, null, workgroupId5)
];

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
      ]
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
    spyOn(TestBed.inject(TeacherDataService), 'retrieveStudentData').and.returnValue(
      Promise.resolve({})
    );
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentPeriodId').and.returnValue(1);
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentPeriod').and.returnValue({ periodId: 1 });
    component.workgroups = workgroups;
    fixture.detectChanges();
  });

  setSort();
});

function setSort() {
  it('should sort by workgroup id ascending', () => {
    component.setSort('team');
    component.setSort('team');
    expectWorkgroupOrder(component.sortedWorkgroups, [
      workgroupId1,
      workgroupId2,
      workgroupId3,
      workgroupId4,
      workgroupId5
    ]);
  });
  it('should sort by workgroup id descending', () => {
    component.setSort('team');
    expectWorkgroupOrder(component.sortedWorkgroups, [
      workgroupId4,
      workgroupId3,
      workgroupId2,
      workgroupId1,
      workgroupId5
    ]);
  });
  it('should sort by completion status ascending', () => {
    component.setSort('status');
    expectWorkgroupOrder(component.sortedWorkgroups, [
      workgroupId2,
      workgroupId3,
      workgroupId1,
      workgroupId4,
      workgroupId5
    ]);
  });
  it('should sort by completion status descending', () => {
    component.setSort('status');
    component.setSort('status');
    expectWorkgroupOrder(component.sortedWorkgroups, [
      workgroupId1,
      workgroupId4,
      workgroupId3,
      workgroupId2,
      workgroupId5
    ]);
  });
  it('should sort by score ascending', () => {
    component.setSort('score');
    expectWorkgroupOrder(component.sortedWorkgroups, [
      workgroupId1,
      workgroupId2,
      workgroupId4,
      workgroupId3,
      workgroupId5
    ]);
  });
  it('should sort by score descending', () => {
    component.setSort('score');
    component.setSort('score');
    expectWorkgroupOrder(component.sortedWorkgroups, [
      workgroupId3,
      workgroupId2,
      workgroupId4,
      workgroupId1,
      workgroupId5
    ]);
  });
}

function expectWorkgroupOrder(workgroups: any[], expectedWorkgroupIdOrder: number[]) {
  for (let w = 0; w < workgroups.length; w++) {
    expect(workgroups[w].workgroupId).toEqual(expectedWorkgroupIdOrder[w]);
  }
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
