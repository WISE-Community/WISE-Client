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
import { ClassroomMonitorTestHelper } from '../classroomMonitorComponents/shared/testing/ClassroomMonitorTestHelper';
import { StudentProgressComponent } from './student-progress.component';

let component: StudentProgressComponent;
let fixture: ComponentFixture<StudentProgressComponent>;
const testHelper: ClassroomMonitorTestHelper = new ClassroomMonitorTestHelper();
const workgroupId1 = testHelper.workgroupId1;
const workgroupId2 = testHelper.workgroupId2;
const workgroupId3 = testHelper.workgroupId3;
const workgroupId4 = testHelper.workgroupId4;
const workgroupId5 = testHelper.workgroupId5;

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
    fixture.detectChanges();
  });

  setSort();
});

function initializeWorkgroups(component: StudentProgressComponent) {
  component.teams = [
    createWorkgroupForTesting(workgroupId1, 'Spongebob', '1.2: Open Response', 30, 0.8),
    createWorkgroupForTesting(workgroupId5, 'Patrick', '1.1: Open Response', 10, 0.6),
    createWorkgroupForTesting(workgroupId3, 'Squidward', '1.5: Open Response', 20, 0.4),
    createWorkgroupForTesting(workgroupId2, 'Sandy', '1.9: Open Response', 50, 0.8),
    createWorkgroupForTesting(workgroupId4, 'Plankton', '1.5: Open Response', 20, 0.8)
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
    const sortTests = [
      createSortTestParams('should sort by team ascending', 'team', 'asc', [
        workgroupId1,
        workgroupId2,
        workgroupId3,
        workgroupId4,
        workgroupId5
      ]),
      createSortTestParams('should sort by team descending', 'team', 'desc', [
        workgroupId5,
        workgroupId4,
        workgroupId3,
        workgroupId2,
        workgroupId1
      ]),
      createSortTestParams('should sort by student ascending', 'student', 'asc', [
        workgroupId5,
        workgroupId4,
        workgroupId2,
        workgroupId1,
        workgroupId3
      ]),
      createSortTestParams('should sort by student descending', 'student', 'desc', [
        workgroupId3,
        workgroupId1,
        workgroupId2,
        workgroupId4,
        workgroupId5
      ]),
      createSortTestParams('should sort by score ascending', 'score', 'asc', [
        workgroupId3,
        workgroupId5,
        workgroupId4,
        workgroupId2,
        workgroupId1
      ]),
      createSortTestParams('should sort by score descending', 'score', 'desc', [
        workgroupId4,
        workgroupId2,
        workgroupId1,
        workgroupId5,
        workgroupId3
      ]),
      createSortTestParams('should sort by completion ascending', 'completion', 'asc', [
        workgroupId5,
        workgroupId4,
        workgroupId3,
        workgroupId1,
        workgroupId2
      ]),
      createSortTestParams('should sort by completion descending', 'completion', 'desc', [
        workgroupId2,
        workgroupId1,
        workgroupId4,
        workgroupId3,
        workgroupId5
      ]),
      createSortTestParams('should sort by location ascending', 'location', 'asc', [
        workgroupId5,
        workgroupId1,
        workgroupId4,
        workgroupId3,
        workgroupId2
      ]),
      createSortTestParams('should sort by location descending', 'location', 'desc', [
        workgroupId2,
        workgroupId4,
        workgroupId3,
        workgroupId1,
        workgroupId5
      ])
    ];
    for (const sortTest of sortTests) {
      it(sortTest.testDescription, () => {
        setSortAndDirection(sortTest.sortField, sortTest.sortDirection);
        testHelper.expectWorkgroupOrder(component.sortedTeams, sortTest.expectedWorkgroupIdOrder);
      });
    }
  });
}

function createSortTestParams(
  testDescription: string,
  sortField: string,
  sortDirection: string,
  expectedWorkgroupIdOrder: number[]
) {
  return {
    testDescription: testDescription,
    sortField: sortField,
    sortDirection: sortDirection,
    expectedWorkgroupIdOrder: expectedWorkgroupIdOrder
  };
}

function setSortAndDirection(field: string, direction: string) {
  component.sort = '';
  component.setSort(field);
  if (direction === 'desc') {
    component.setSort(field);
  }
}
