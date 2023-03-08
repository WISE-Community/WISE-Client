import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { StudentDataService } from '../../../services/studentDataService';
import { WroteXNumberOfWordsConstraintStrategy } from './WroteXNumberOfWordsConstraintStrategy';

let dataService: StudentDataService;
let strategy: WroteXNumberOfWordsConstraintStrategy;

describe('WroteXNumberOfWordsConstraintStrategy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule]
    });
    dataService = TestBed.inject(StudentDataService);
    strategy = new WroteXNumberOfWordsConstraintStrategy();
    strategy.dataService = dataService;
  });
  evaluate();
});

function evaluate() {
  describe('evaluate()', () => {
    const criteria = {
      params: {
        nodeId: 'node1',
        componentId: 'component1',
        requiredNumberOfWords: 10
      }
    };
    it('should return false when less than required words were written', () => {
      expectEvaluate(criteria, { studentData: { response: 'one two three four five' } }, false);
    });
    it('should return true when at least required words were written', () => {
      expectEvaluate(criteria, { studentData: { response: '1 2 3 4 5 6 7 8 9 0' } }, true);
    });
  });
}

function expectEvaluate(criteria: any, componentState: any, expected: boolean): void {
  spyOn(dataService, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(
    componentState
  );
  expect(strategy.evaluate(criteria)).toEqual(expected);
}
