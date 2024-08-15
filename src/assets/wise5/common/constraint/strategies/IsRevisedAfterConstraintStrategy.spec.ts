import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { StudentDataService } from '../../../services/studentDataService';
import { IsRevisedAfterConstraintStrategy } from './IsRevisedAfterConstraintStrategy';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let dataService: StudentDataService;
let strategy: IsRevisedAfterConstraintStrategy;

describe('IsRevisedAfterConstraintStrategy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    dataService = TestBed.inject(StudentDataService);
    strategy = new IsRevisedAfterConstraintStrategy();
    strategy.dataService = dataService;
  });
  evaluate();
});

function evaluate() {
  describe('evaluate()', () => {
    const criteria = {
      params: {
        isRevisedAfterNodeId: 'node1',
        criteriaCreatedTimestamp: 2000
      }
    };
    it('should return false when there are no component states', () => {
      expectEvaluate(criteria, null, false);
    });
    it('should return false when there is no component state after criteriaCreatedTimestamp', () => {
      expectEvaluate(
        criteria,
        { nodeId: 'node1', componentId: 'component1', clientSaveTime: 1000 },
        false
      );
    });
    it('should return true when there is a component state after criteriaCreatedTimestamp', () => {
      expectEvaluate(
        criteria,
        { nodeId: 'node1', componentId: 'component1', clientSaveTime: 3000 },
        true
      );
    });
  });
}

function expectEvaluate(criteria: any, componentState: any, expected: boolean): void {
  spyOn(dataService, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(
    componentState
  );
  expect(strategy.evaluate(criteria)).toEqual(expected);
}
