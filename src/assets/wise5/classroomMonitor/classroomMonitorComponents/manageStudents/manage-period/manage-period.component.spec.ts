import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { of } from 'rxjs';
import { GetWorkgroupService } from '../../../../../../app/services/getWorkgroupService';
import { WorkgroupService } from '../../../../../../app/services/workgroup.service';
import { ConfigService } from '../../../../services/configService';
import { ManagePeriodComponent } from './manage-period.component';
import classmateUserInfos from '../../../../../../app/services/sampleData/sample_classmateUserInfos.json';
import { ManageTeamsComponent } from '../manage-teams/manage-teams.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let fixture: ComponentFixture<ManagePeriodComponent>;
let component: ManagePeriodComponent;
let configService: ConfigService;
let workgroupService: WorkgroupService;
const workgroupsInPeriod = new Map<number, any>();
workgroupsInPeriod.set(5, { workgroupId: 5, periodId: 1, users: [{ username: 'student0101' }] });
workgroupsInPeriod.set(7, {
  workgroupId: 7,
  periodId: 1,
  users: [{ username: 'student0103' }, { username: 'student0104' }]
});

describe('ManagePeriodComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [ManagePeriodComponent, ManageTeamsComponent],
    imports: [MatCardModule],
    providers: [ConfigService, GetWorkgroupService, WorkgroupService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    configService = TestBed.inject(ConfigService);
    workgroupService = TestBed.inject(WorkgroupService);
    fixture = TestBed.createComponent(ManagePeriodComponent);
    component = fixture.componentInstance;
    component.period = {
      periodId: 1,
      periodName: '1'
    };
    spyOn(component, 'registerAutoScroll').and.callFake(() => {});
    fixture.detectChanges();
  });
  initTeams();
  initStudents();
});

function initTeams() {
  describe('initTeams', () => {
    it('should initialize teams that are in this period including empty teams', () => {
      spyOn(workgroupService, 'getWorkgroupsInPeriod').and.returnValue(workgroupsInPeriod);
      spyOn(configService, 'getUsersNotInWorkgroupInPeriod').and.returnValue([]);
      const allWorkgroupsInPeriodSpy = spyOn(
        TestBed.inject(GetWorkgroupService),
        'getAllWorkgroupsInPeriod'
      ).and.callFake((periodId: number) => {
        return of([{ id: 5 }, { id: 7 }, { id: 8 }]);
      });
      component.initTeams();
      expect(component.teams.size).toEqual(2);
      const teamsArray = Array.from(component.teams.values());
      expect(teamsArray[0].workgroupId).toEqual(5);
      expect(teamsArray[1].workgroupId).toEqual(7);
      expect(component.emptyTeams.size).toEqual(1);
      const emptyTeamsArray = Array.from(component.emptyTeams.values());
      expect(emptyTeamsArray[0].workgroupId).toEqual(8);
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
