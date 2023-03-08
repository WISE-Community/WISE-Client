import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { StudentDataService } from '../../../services/studentDataService';
import { IsCorrectConstraintStrategy } from './IsCorrectConstraintStrategy';

let dataService: StudentDataService;
let strategy: IsCorrectConstraintStrategy;

describe('IsCorrectConstraintStrategy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule]
    });
    dataService = TestBed.inject(StudentDataService);
    strategy = new IsCorrectConstraintStrategy();
    strategy.dataService = dataService;
  });
  evaluate();
});

function evaluate() {
  describe('evaluate()', () => {
    const criteria = {
      params: {
        nodeId: 'node1',
        componentId: 'component1'
      }
    };
    it('should return false when no component states', () => {
      expectEvaluate(criteria, [], false);
    });
    it('should return false when there is no correct data', () => {
      expectEvaluate(criteria, [{ studentData: { isCorrect: false } }], false);
    });
    it('should return true when there is correct data', () => {
      expectEvaluate(criteria, [{ studentData: { isCorrect: true } }], true);
    });
  });
}

function expectEvaluate(criteria: any, componentStates: any[], expected: boolean): void {
  spyOn(dataService, 'getComponentStatesByNodeIdAndComponentId').and.returnValue(componentStates);
  expect(strategy.evaluate(criteria)).toEqual(expected);
}
