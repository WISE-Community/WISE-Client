import { TestBed } from '@angular/core/testing';
import { PathService } from '../../assets/wise5/services/pathService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';

let service: PathService;
describe('PathService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StudentTeacherCommonServicesModule]
    });
    service = TestBed.inject(PathService);
  });
  consolidatePaths();
});

function consolidatePaths() {
  describe('consolidatePaths()', () => {
    it('should consolidate all the paths into a linear list of node ids', () => {
      const allPaths = [
        ['group1', 'node1', 'node2', 'node3', 'node4', 'node8'],
        ['group1', 'node1', 'node2', 'node5', 'node6', 'node7', 'node8']
      ];
      const consolidatedPaths = service.consolidatePaths(allPaths);
      expect(consolidatedPaths).toEqual([
        'group1',
        'node1',
        'node2',
        'node3',
        'node4',
        'node5',
        'node6',
        'node7',
        'node8'
      ]);
    });
  });
}
