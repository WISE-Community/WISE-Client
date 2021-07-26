import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../../assets/wise5/services/configService';
import { WorkgroupService } from './workgroup.service';
import classmateUserInfos from './sampleData/sample_classmateUserInfos.json';

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
      providers: [{ provide: ConfigService, useClass: ConfigServiceStub }, WorkgroupService]
    });
    workgroupService = TestBed.inject(WorkgroupService);
  });
  getWorkgroupsInPeriod();
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
