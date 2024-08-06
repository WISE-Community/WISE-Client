import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../../assets/wise5/services/configService';
import { WorkgroupService } from './workgroup.service';
import classmateUserInfos from './sampleData/sample_classmateUserInfos.json';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let workgroupService: WorkgroupService;

class ConfigServiceStub {
  getClassmateUserInfos() {
    return classmateUserInfos;
  }
  getDisplayUsernamesByWorkgroupId(workgroupId: number) {
    return `Workgroup ${workgroupId}`;
  }
}

describe('WorkgroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [{ provide: ConfigService, useClass: ConfigServiceStub }, WorkgroupService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    workgroupService = TestBed.inject(WorkgroupService);
  });
  getWorkgroupsInPeriod();
  isUserInAnyWorkgroup();
});

function getWorkgroupsInPeriod() {
  describe('getWorkgroupsInPeriod()', () => {
    it('should return only workgroups in period with display names', () => {
      const workgroups = workgroupService.getWorkgroupsInPeriod(1);
      expect(workgroups.size).toEqual(2);
      expect(workgroups.get(5).displayNames).toEqual('Workgroup 5');
      expect(workgroups.get(7).displayNames).toEqual('Workgroup 7');
    });
  });
}

function isUserInAnyWorkgroup() {
  describe('isUserInAnyWorkgroup', () => {
    it('should return true when the user belongs in a workgroup and false otherwise', () => {
      expect(workgroupService.isUserInAnyWorkgroup({ id: 1 })).toBeTruthy();
      expect(workgroupService.isUserInAnyWorkgroup({ id: 5 })).toBeFalsy();
    });
  });
}
