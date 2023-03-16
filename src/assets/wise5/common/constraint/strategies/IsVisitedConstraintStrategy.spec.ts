import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { StudentDataService } from '../../../services/studentDataService';
import { IsVisitedConstraintStrategy } from './IsVisitedConstraintStrategy';

let dataService: StudentDataService;
let strategy: IsVisitedConstraintStrategy;

describe('IsVisitedConstraintStrategy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule]
    });
    dataService = TestBed.inject(StudentDataService);
    strategy = new IsVisitedConstraintStrategy();
    strategy.dataService = dataService;
  });
  evaluate();
});

function evaluate() {
  let criteria;
  const isVisitedEvents = [
    { nodeId: 'node1', event: 'nodeEntered' },
    { nodeId: 'node2', event: 'nodeEntered' },
    { nodeId: 'node3', event: 'nodeEntered' }
  ];
  describe('evaluate()', () => {
    beforeEach(() => {
      criteria = {
        params: {
          nodeId: 'node4'
        }
      };
    });
    it('should return false when there are no events', () => {
      spyOn(dataService, 'getEvents').and.returnValue([]);
      criteria.params.nodeId = 'node1';
      expect(strategy.evaluate(criteria)).toEqual(false);
    });
    it('should return false when criteria node has not been visited', () => {
      spyOn(dataService, 'getEvents').and.returnValue(isVisitedEvents);
      expect(strategy.evaluate(criteria)).toEqual(false);
    });
    it('should return true when criteria node has been visited', () => {
      spyOn(dataService, 'getEvents').and.returnValue(isVisitedEvents);
      criteria.params.nodeId = 'node2';
      expect(strategy.evaluate(criteria)).toEqual(true);
    });
  });
}
