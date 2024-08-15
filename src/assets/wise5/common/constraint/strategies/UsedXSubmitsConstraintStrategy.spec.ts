import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { StudentDataService } from '../../../services/studentDataService';
import { UsedXSubmitsConstraintStrategy } from './UsedXSubmitsConstraintStrategy';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let dataService: StudentDataService;
let strategy: UsedXSubmitsConstraintStrategy;

describe('UsedXSubmitsConstraintStrategy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    dataService = TestBed.inject(StudentDataService);
    strategy = new UsedXSubmitsConstraintStrategy();
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
        requiredSubmitCount: 2
      }
    };
    it('should return false when submitCount is less than required count', () => {
      expectEvaluate(criteria, [{ studentData: { submitCounter: 1 } }], false);
    });
    it('should return true when submitCount is the required count', () => {
      expectEvaluate(criteria, [{ studentData: { submitCounter: 2 } }], true);
    });
  });
}

function expectEvaluate(criteria: any, componentStates: any[], expected: boolean): void {
  spyOn(dataService, 'getComponentStatesByNodeIdAndComponentId').and.returnValue(componentStates);
  expect(strategy.evaluate(criteria)).toEqual(expected);
}
