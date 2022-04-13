import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { ManageStudentsComponent } from './manage-students.component';
import { TeacherDataService } from '../../../../services/teacherDataService';

class TeacherDataServiceStub {
  getCurrentPeriod() {}

  getPeriods() {
    return [{ periodId: -1 }, { periodId: 1 }, { periodId: 2 }];
  }
}

let teacherDataService: TeacherDataService;
let fixture: ComponentFixture<ManageStudentsComponent>;
let http: HttpTestingController;
let component: ManageStudentsComponent;

describe('ManageStudentsComponent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ManageStudentsComponent],
      imports: [HttpClientTestingModule],
      providers: [{ provide: TeacherDataService, useClass: TeacherDataServiceStub }]
    });
  });
  beforeEach(() => {
    teacherDataService = TestBed.inject(TeacherDataService);
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ManageStudentsComponent);
    component = fixture.componentInstance;
  });
  periodsShown();
});

function periodsShown() {
  it('should show single period when one period is selected', () => {
    component.setVisiblePeriods({ periodId: 1 });
    expect(component.periods.length).toEqual(1);
  });
  it('should show each period when All Periods is selected', () => {
    component.setVisiblePeriods({ periodId: -1 });
    expect(component.periods.length).toEqual(3);
  });
}
