import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { GetWorkgroupService } from '../../../../../../app/services/getWorkgroupService';
import { ConfigService } from '../../../../services/configService';
import { ManagePeriodComponent } from './manage-period.component';

let fixture: ComponentFixture<ManagePeriodComponent>;
let component: ManagePeriodComponent;
let configService: ConfigService;
const classmateUserInfos = [
  {
    workgroupId: 7,
    periodId: 1,
    users: [{ username: 'student0103' }, { username: 'student0104' }]
  },
  { workgroupId: 6, periodId: 2, users: [{ username: 'student0102' }] },
  { workgroupId: 5, periodId: 1, users: [{ username: 'student0101' }] }
];

describe('ManagePeriod', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ManagePeriodComponent],
      providers: [ConfigService, GetWorkgroupService, UpgradeModule]
    });
    configService = TestBed.inject(ConfigService);
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePeriodComponent);
    component = fixture.componentInstance;
    component.period = {
      periodId: 1,
      periodName: '1'
    };
    fixture.detectChanges();
  });
  initTeams();
  initStudents();
});

function initTeams() {
  describe('initTeams', () => {
    it('should initialize teams that are in this period including empty teams', () => {
      spyOn(configService, 'getClassmateUserInfos').and.returnValue(classmateUserInfos);
      spyOn(configService, 'getDisplayUsernamesByWorkgroupId').and.returnValue('student one');
      const allWorkgroupsInPeriodSpy = spyOn(
        TestBed.inject(GetWorkgroupService),
        'getAllWorkgroupsInPeriod'
      ).and.callFake((periodId: number) => {
        return of([{ id: 5 }, { id: 7 }, { id: 8 }]);
      });
      component.initTeams();
      expect(component.teams.size).toEqual(3);
      const teamsArray = Array.from(component.teams.values());
      expect(teamsArray[0].workgroupId).toEqual(5);
      expect(teamsArray[1].workgroupId).toEqual(7);
      expect(teamsArray[2].workgroupId).toEqual(8);
      expect(allWorkgroupsInPeriodSpy).toHaveBeenCalled();
    });
  });
}

function initStudents() {
  describe('initStudents', () => {
    it('should initialize students that are in this period', () => {
      spyOn(configService, 'getClassmateUserInfos').and.returnValue(classmateUserInfos);
      component.initStudents();
      expect(component.students.size).toEqual(3);
    });
  });
}
