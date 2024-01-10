import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { StudentDataService } from '../../../services/studentDataService';
import { IsVisitedAndRevisedAfterConstraintStrategy } from './IsVisitedAndRevisedAfterConstraintStrategy';

let dataService: StudentDataService;
let strategy: IsVisitedAndRevisedAfterConstraintStrategy;

describe('IsVisitedAndRevisedAfterConstraintStrategy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule]
    });
    dataService = TestBed.inject(StudentDataService);
    strategy = new IsVisitedAndRevisedAfterConstraintStrategy();
    strategy.dataService = dataService;
  });
  evaluate();
});

function evaluate() {
  const isVisitedAndRevisedAfterCriteria = {
    params: {
      isVisitedAfterNodeId: 'node1',
      isRevisedAfterNodeId: 'node2',
      isRevisedAfterComponentId: 'component2',
      criteriaCreatedTimestamp: 3000
    }
  };
  describe('evaluate()', () => {
    it(`should return false when they did not visit the node to visit after the
      criteriaCreatedTimestamp and did not do any work on the revise node`, () => {
      expectIsVisitedAndRevisedAfterCriteria(1000, null, false);
    });
    it(`should return false when they did not visit the node to visit after the
      criteriaCreatedTimestamp and did not revise after criteriaCreatedTimestamp`, () => {
      expectIsVisitedAndRevisedAfterCriteria(1000, 2000, false);
    });
    it(`should return false when they visited the node to visit after the criteriaCreatedTimestamp but
      did not revise after criteriaCreatedTimestamp`, () => {
      expectIsVisitedAndRevisedAfterCriteria(4000, 2000, false);
    });
    it(`should return true when visited the node to visit after the criteriaCreatedTimestamp and then
      revised after criteriaCreatedTimestamp`, () => {
      expectIsVisitedAndRevisedAfterCriteria(4000, 5000, true);
    });
  });

  function expectIsVisitedAndRevisedAfterCriteria(
    eventTimestamp: number,
    componentStateTimestamp: number,
    expectedValue: boolean
  ): void {
    const events = [{ nodeId: 'node1', event: 'nodeEntered', clientSaveTime: eventTimestamp }];
    const componentState =
      componentStateTimestamp == null
        ? null
        : {
            nodeId: 'node2',
            componentId: 'component2',
            clientSaveTime: componentStateTimestamp
          };
    isVisitedAndRevisedAfterCriteriaSpies(events, componentState);
    expect(strategy.evaluate(isVisitedAndRevisedAfterCriteria)).toEqual(expectedValue);
  }
}

function isVisitedAndRevisedAfterCriteriaSpies(events: any[], componentState: any): void {
  spyOn(dataService, 'getEvents').and.returnValue(events);
  spyOn(dataService, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(
    componentState
  );
}
