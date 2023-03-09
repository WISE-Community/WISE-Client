import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { StudentDataService } from '../../../services/studentDataService';
import { IsVisitedAfterConstraintStrategy } from './IsVisitedAfterConstraintStrategy';

let dataService: StudentDataService;
let strategy: IsVisitedAfterConstraintStrategy;

describe('IsVisitedAfterConstraintStrategy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule]
    });
    dataService = TestBed.inject(StudentDataService);
    strategy = new IsVisitedAfterConstraintStrategy();
    strategy.dataService = dataService;
  });
  evaluate();
});

function evaluate() {
  describe('evaluate()', () => {
    const criteria = {
      params: {
        isVisitedAfterNodeId: 'node1',
        criteriaCreatedTimestamp: 2000
      }
    };
    it('should return false when there is no nodeEntered after criteriaCreatedTimestamp', () => {
      expectEvaluate(
        criteria,
        [{ nodeId: 'node1', event: 'nodeEntered', clientSaveTime: 1000 }],
        false
      );
    });
    it('should return true when there is nodeEntered after criteriaCreatedTimestamp', () => {
      expectEvaluate(
        criteria,
        [{ nodeId: 'node1', event: 'nodeEntered', clientSaveTime: 3000 }],
        true
      );
    });
  });
}

function expectEvaluate(criteria: any, events: any[], expected: boolean): void {
  spyOn(dataService, 'getEvents').and.returnValue(events);
  expect(strategy.evaluate(criteria)).toEqual(expected);
}
