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
import { RouterTestingModule } from '@angular/router/testing';

class SortTestParams {
  constructor(
    public testDescription: string,
    public sortField: string,
    public sortDirection: string,
    public expectedWorkgroupIdOrder: number[]
  ) {}
}

let component: StudentProgressComponent;
let fixture: ComponentFixture<StudentProgressComponent>;
const testHelper: ClassroomMonitorTestHelper = new ClassroomMonitorTestHelper();
const { workgroupId1, workgroupId2, workgroupId3, workgroupId4, workgroupId5 } = testHelper;

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
        ReactiveFormsModule,
        RouterTestingModule
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
  component.students = testHelper.students;
}

function setSort() {
  describe('setSort', () => {
    beforeEach(() => {
      initializeWorkgroups(component);
    });
    const sortTests = [
      new SortTestParams('should sort by team ascending', 'team', 'asc', [
        workgroupId1,
        workgroupId2,
        workgroupId3,
        workgroupId4,
        workgroupId5
      ]),
      new SortTestParams('should sort by team descending', 'team', 'desc', [
        workgroupId5,
        workgroupId4,
        workgroupId3,
        workgroupId2,
        workgroupId1
      ]),
      new SortTestParams('should sort by student ascending', 'student', 'asc', [
        workgroupId5,
        workgroupId2,
        workgroupId4,
        workgroupId1,
        workgroupId3
      ]),
      new SortTestParams('should sort by student descending', 'student', 'desc', [
        workgroupId3,
        workgroupId1,
        workgroupId4,
        workgroupId2,
        workgroupId5
      ]),
      new SortTestParams('should sort by first name ascending', 'firstName', 'asc', [
        workgroupId5,
        workgroupId2,
        workgroupId4,
        workgroupId1,
        workgroupId3
      ]),
      new SortTestParams('should sort by first name descending', 'firstName', 'desc', [
        workgroupId3,
        workgroupId1,
        workgroupId4,
        workgroupId2,
        workgroupId5
      ]),
      new SortTestParams('should sort by last name ascending', 'lastName', 'asc', [
        workgroupId2,
        workgroupId4,
        workgroupId1,
        workgroupId5,
        workgroupId3
      ]),
      new SortTestParams('should sort by last name descending', 'lastName', 'desc', [
        workgroupId3,
        workgroupId5,
        workgroupId1,
        workgroupId4,
        workgroupId2
      ]),
      new SortTestParams('should sort by score ascending', 'score', 'asc', [
        workgroupId3,
        workgroupId5,
        workgroupId1,
        workgroupId2,
        workgroupId4
      ]),
      new SortTestParams('should sort by score descending', 'score', 'desc', [
        workgroupId1,
        workgroupId2,
        workgroupId4,
        workgroupId5,
        workgroupId3
      ]),
      new SortTestParams('should sort by completion ascending', 'completion', 'asc', [
        workgroupId5,
        workgroupId3,
        workgroupId4,
        workgroupId1,
        workgroupId2
      ]),
      new SortTestParams('should sort by completion descending', 'completion', 'desc', [
        workgroupId2,
        workgroupId1,
        workgroupId3,
        workgroupId4,
        workgroupId5
      ]),
      new SortTestParams('should sort by location ascending', 'location', 'asc', [
        workgroupId5,
        workgroupId1,
        workgroupId3,
        workgroupId4,
        workgroupId2
      ]),
      new SortTestParams('should sort by location descending', 'location', 'desc', [
        workgroupId2,
        workgroupId3,
        workgroupId4,
        workgroupId1,
        workgroupId5
      ])
    ];
    for (const sortTest of sortTests) {
      it(sortTest.testDescription, () => {
        setSortAndDirection(sortTest.sortField, sortTest.sortDirection);
        testHelper.expectWorkgroupOrder(
          component.sortedStudents,
          sortTest.expectedWorkgroupIdOrder
        );
      });
    }
  });
}

function setSortAndDirection(field: string, direction: string) {
  component.sort = '';
  component.setSort(field);
  if (direction === 'desc') {
    component.setSort(field);
  }
}
