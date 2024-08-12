import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { StudentDataService } from '../../../services/studentDataService';
import { BranchPathTakenConstraintStrategy } from './BranchPathTakenConstraintStrategy';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let dataService: StudentDataService;
let strategy: BranchPathTakenConstraintStrategy;

describe('BranchPathTakenConstraintStrategy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    dataService = TestBed.inject(StudentDataService);
    strategy = new BranchPathTakenConstraintStrategy();
    strategy.dataService = dataService;
  });
  evaluate();
});

function evaluate() {
  describe('evaluate()', () => {
    const criteria = {
      params: {
        fromNodeId: 'node1',
        toNodeId: 'node2'
      }
    };
    it('should return false when there are no branch path taken events', () => {
      expectEvaluate(criteria, [], false);
    });
    it('should return false when fromNodeId and toNodeId do not match any branch path taken', () => {
      expectEvaluate(criteria, [{ data: { fromNodeId: 'node1', toNodeId: 'node3' } }], false);
    });
    it('should return true when fromNodeId and toNodeId match a branch path taken', () => {
      expectEvaluate(criteria, [{ data: { fromNodeId: 'node1', toNodeId: 'node2' } }], true);
    });
  });
}

function expectEvaluate(criteria: any, branchPathTaken: any[], expected: boolean): void {
  spyOn(dataService, 'getBranchPathTakenEventsByNodeId').and.returnValue(branchPathTaken);
  expect(strategy.evaluate(criteria)).toEqual(expected);
}
