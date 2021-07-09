import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { configureTestSuite } from 'ng-bullet';
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
      providers: [ConfigService, UpgradeModule]
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
  initializeTeams();
  initializeStudents();
});

function initializeTeams() {
  describe('initializeTeams', () => {
    it('should initialize teams that are in this period', () => {
      spyOn(configService, 'getClassmateUserInfos').and.returnValue(classmateUserInfos);
      spyOn(configService, 'getDisplayUsernamesByWorkgroupId').and.returnValue('student one');
      component.initializeTeams();
      expect(component.teams.size).toEqual(2);
      const teamsArray = Array.from(component.teams);
      expect(teamsArray[0].workgroupId).toEqual(5);
      expect(teamsArray[1].workgroupId).toEqual(7);
    });
  });
}

function initializeStudents() {
  describe('initializeStudents', () => {
    it('should initialize students that are in this period', () => {
      spyOn(configService, 'getClassmateUserInfos').and.returnValue(classmateUserInfos);
      component.initializeStudents();
      expect(component.students.size).toEqual(3);
    });
  });
}
