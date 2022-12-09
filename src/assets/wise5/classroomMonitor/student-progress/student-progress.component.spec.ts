import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { WorkgroupSelectAutocompleteComponent } from '../../../../app/classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';
import { ConfigService } from '../../services/configService';
import { TeacherDataService } from '../../services/teacherDataService';
import { ClassroomMonitorTestingModule } from '../classroom-monitor-testing.module';
import { StudentProgressComponent } from './student-progress.component';
import { StudentProgressComponentTestHelper } from './student-progress.component.test.helper';

let component: StudentProgressComponent;
let fixture: ComponentFixture<StudentProgressComponent>;
let testHelper: StudentProgressComponentTestHelper;

describe('StudentProgressComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentProgressComponent, WorkgroupSelectAutocompleteComponent],
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
    fixture = TestBed.createComponent(StudentProgressComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(ConfigService), 'getPermissions').and.returnValue({
      canViewStudentNames: true,
      canGradeStudentWork: true,
      canAuthorProject: true
    });
    spyOn(TestBed.inject(ConfigService), 'getClassmateUserInfos').and.returnValue([]);
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentPeriod').and.returnValue({ periodId: 1 });
    testHelper = new StudentProgressComponentTestHelper();
    fixture.detectChanges();
  });

  setSort();
});

function initializeWorkgroups(component: StudentProgressComponent) {
  component.teams = [
    createWorkgroupForTesting(testHelper.workgroupId1, 'Spongebob', '1.2: Open Response', 30, 0.8),
    createWorkgroupForTesting(testHelper.workgroupId5, 'Patrick', '1.1: Open Response', 10, 0.6),
    createWorkgroupForTesting(testHelper.workgroupId3, 'Squidward', '1.5: Open Response', 20, 0.4),
    createWorkgroupForTesting(testHelper.workgroupId2, 'Sandy', '1.9: Open Response', 50, 0.8),
    createWorkgroupForTesting(testHelper.workgroupId4, 'Plankton', '1.5: Open Response', 20, 0.8)
  ];
}

function createWorkgroupForTesting(
  workgroupId: number,
  username: string,
  location: string,
  completionPct: number,
  scorePct: number
): any {
  return {
    completion: {
      completionPct
    },
    location: location,
    scorePct: scorePct,
    username: username,
    workgroupId: workgroupId
  };
}

function setSort() {
  describe('setSort', () => {
    beforeEach(() => {
      initializeWorkgroups(component);
    });
    it('should sort by team ascending', () => {
      component.sort = '';
      component.setSort('team');
      testHelper.expectWorkgroupOrder(component.sortedTeams, [
        testHelper.workgroupId1,
        testHelper.workgroupId2,
        testHelper.workgroupId3,
        testHelper.workgroupId4,
        testHelper.workgroupId5
      ]);
    });
    it('should sort by team descending', () => {
      component.sort = '';
      component.setSort('team');
      component.setSort('team');
      testHelper.expectWorkgroupOrder(component.sortedTeams, [
        testHelper.workgroupId5,
        testHelper.workgroupId4,
        testHelper.workgroupId3,
        testHelper.workgroupId2,
        testHelper.workgroupId1
      ]);
    });
    it('should sort by student ascending', () => {
      component.sort = '';
      component.setSort('student');
      testHelper.expectWorkgroupOrder(component.sortedTeams, [
        testHelper.workgroupId5,
        testHelper.workgroupId4,
        testHelper.workgroupId2,
        testHelper.workgroupId1,
        testHelper.workgroupId3
      ]);
    });
    it('should sort by student descending', () => {
      component.sort = '';
      component.setSort('student');
      component.setSort('student');
      testHelper.expectWorkgroupOrder(component.sortedTeams, [
        testHelper.workgroupId3,
        testHelper.workgroupId1,
        testHelper.workgroupId2,
        testHelper.workgroupId4,
        testHelper.workgroupId5
      ]);
    });
    it('should sort by score ascending', () => {
      component.sort = '';
      component.setSort('score');
      testHelper.expectWorkgroupOrder(component.sortedTeams, [
        testHelper.workgroupId3,
        testHelper.workgroupId5,
        testHelper.workgroupId4,
        testHelper.workgroupId2,
        testHelper.workgroupId1
      ]);
    });
    it('should sort by score descending', () => {
      component.sort = '';
      component.setSort('score');
      component.setSort('-score');
      testHelper.expectWorkgroupOrder(component.sortedTeams, [
        testHelper.workgroupId4,
        testHelper.workgroupId2,
        testHelper.workgroupId1,
        testHelper.workgroupId5,
        testHelper.workgroupId3
      ]);
    });
    it('should sort by completion ascending', () => {
      component.sort = '';
      component.setSort('completion');
      testHelper.expectWorkgroupOrder(component.sortedTeams, [
        testHelper.workgroupId5,
        testHelper.workgroupId4,
        testHelper.workgroupId3,
        testHelper.workgroupId1,
        testHelper.workgroupId2
      ]);
    });
    it('should sort by completion descending', () => {
      component.sort = '';
      component.setSort('completion');
      component.setSort('completion');
      testHelper.expectWorkgroupOrder(component.sortedTeams, [
        testHelper.workgroupId2,
        testHelper.workgroupId1,
        testHelper.workgroupId4,
        testHelper.workgroupId3,
        testHelper.workgroupId5
      ]);
    });
    it('should sort by location ascending', () => {
      component.sort = '';
      component.setSort('location');
      testHelper.expectWorkgroupOrder(component.sortedTeams, [
        testHelper.workgroupId5,
        testHelper.workgroupId1,
        testHelper.workgroupId4,
        testHelper.workgroupId3,
        testHelper.workgroupId2
      ]);
    });
    it('should sort by location descending', () => {
      component.sort = '';
      component.setSort('location');
      component.setSort('location');
      testHelper.expectWorkgroupOrder(component.sortedTeams, [
        testHelper.workgroupId2,
        testHelper.workgroupId4,
        testHelper.workgroupId3,
        testHelper.workgroupId1,
        testHelper.workgroupId5
      ]);
    });
  });
}
