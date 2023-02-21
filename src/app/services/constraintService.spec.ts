import { TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { ConstraintService } from '../../assets/wise5/services/constraintService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentDataService } from '../../assets/wise5/services/studentDataService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { UtilService } from '../../assets/wise5/services/utilService';
import { NotebookService } from '../../assets/wise5/services/notebookService';

let annotationService: AnnotationService;
let configService: ConfigService;
let dataService: StudentDataService;
let notebookService: NotebookService;
let service: ConstraintService;
let utilService: UtilService;
let criteria1: any;
let criteria2: any;

describe('ConstraintService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule]
    });
    annotationService = TestBed.inject(AnnotationService);
    configService = TestBed.inject(ConfigService);
    dataService = TestBed.inject(StudentDataService);
    notebookService = TestBed.inject(NotebookService);
    service = TestBed.inject(ConstraintService);
    utilService = TestBed.inject(UtilService);
    criteria1 = {
      name: 'isCompleted',
      params: {
        nodeId: 'node1'
      }
    };
    criteria2 = {
      name: 'isCompleted',
      params: {
        nodeId: 'node2'
      }
    };
  });

  shouldEvaluateNodeConstraintWithOneRemovalCriteria();
  shouldEvaluateNodeConstraintWithTwoRemovalCriteriaRequiringAll();
  shouldEvaluateNodeConstraintWithTwoRemovalCriteriaRequiringAny();
  shouldEvaluateIsCorrectCriteriaFalseWhenNoComponentStates();
  shouldEvaluateIsCorrectCriteriaFalse();
  shouldEvaluateIsCorrectCriteriaTrue();
  shouldEvaluateBranchPathTakenWhenNoPathsTaken();
  shouldEvaluateBranchPathTakenFalse();
  shouldEvaluateBranchPathTakenTrue();
  shouldEvaluateIsVisitedCriteriaFalseWithNoEvents();
  shouldEvaluateIsVisitedCriteriaFalse();
  shouldEvaluateIsVisitedCriteriaTrue();
  shouldEvaluateIsVisitedAfterCriteriaFalse();
  shouldEvaluateIsVisitedAfterCriteriaTrue();
  shouldEvaluateIsRevisedAfterCriteriaFalseWithNoComponentStates();
  shouldEvaluateIsRevisedAfterCriteriaFalse();
  shouldEvaluateIsRevisedAfterCriteriaTrue();
  shouldEvaluateIsVisitedAndRevisedAfterCriteriaFalseWithNoComponentStates();
  shouldEvaluateIsVisitedAndRevisedAfterCriteriaFalse();
  shouldEvaluateIsVisitedAndRevisedAfterCriteriaTrue();
  shouldEvaluateIsVisitedAndRevisedAfterCriteriaFalseNoVisitAfter();
  shouldEvaluateIsVisitedAndRevisedAfterCriteriaFalseVisitAfterNoRevise();
  shouldEvaluateScoreCriteriaFalse();
  shouldEvaluateScoreCriteriaTrue();
  shouldEvaluateUsedXSubmitsCriteriaFalse();
  shouldEvaluateUsedXSubmitsCriteriaTrue();
  shouldEvaluateNumberOfWordsWrittenCriteriaFalse();
  shouldEvaluateNumberOfWordsWrittenCriteriaTrue();
  shouldEvaluateAddXNumberOfNotesOnThisStepCriteriaFalse();
  shouldEvaluateAddXNumberOfNotesOnThisStepCriteriaTrue();
  shouldEvaluateCriterias();
});

function shouldEvaluateNodeConstraintWithOneRemovalCriteria() {
  it('should evaluate node constraint with one removal criteria', () => {
    spyOn(dataService, 'isCompleted').and.returnValue(true);
    const constraint = {
      id: 'node1Constraint1',
      action: '',
      targetId: 'node1',
      removalCriteria: [
        {
          name: 'isCompleted',
          params: {
            nodeId: 'node1'
          }
        }
      ],
      removalConditional: 'all'
    };
    expect(service.evaluateNodeConstraint(constraint)).toEqual(true);
  });
}

function shouldEvaluateNodeConstraintWithTwoRemovalCriteriaRequiringAll() {
  it('should evaluate node constraint with two removal criteria requiring all', () => {
    const removalCriteria1 = {
      name: 'isCompleted',
      params: {
        nodeId: 'node1'
      }
    };
    const removalCriteria2 = {
      name: 'isCompleted',
      params: {
        nodeId: 'node2'
      }
    };
    spyOn(dataService, 'isCompleted')
      .withArgs('node1')
      .and.returnValue(true)
      .withArgs('node2')
      .and.returnValue(false);
    const constraint = {
      id: 'node3Constraint1',
      action: '',
      targetId: 'node3',
      removalCriteria: [removalCriteria1, removalCriteria2],
      removalConditional: 'all'
    };
    expect(service.evaluateNodeConstraint(constraint)).toEqual(false);
  });
}

function shouldEvaluateNodeConstraintWithTwoRemovalCriteriaRequiringAny() {
  it('should evaluate node constraint with two removal criteria requiring any', () => {
    const removalCriteria1 = {
      name: 'isCompleted',
      params: {
        nodeId: 'node1'
      }
    };
    const removalCriteria2 = {
      name: 'isCompleted',
      params: {
        nodeId: 'node2'
      }
    };
    spyOn(dataService, 'isCompleted')
      .withArgs('node1')
      .and.returnValue(true)
      .withArgs('node2')
      .and.returnValue(false);
    const constraint = {
      id: 'node3Constraint1',
      action: '',
      targetId: 'node3',
      removalCriteria: [removalCriteria1, removalCriteria2],
      removalConditional: 'any'
    };
    expect(service.evaluateNodeConstraint(constraint)).toEqual(true);
  });
}

function shouldEvaluateIsCorrectCriteriaFalseWhenNoComponentStates() {
  it('should evaluate is correct criteria false when no component states', () => {
    const componentStates = [];
    spyOn(dataService, 'getComponentStatesByNodeIdAndComponentId').and.returnValue(componentStates);
    const criteria = {
      params: {
        nodeId: 'node1',
        componentId: 'component1'
      }
    };
    expect(service.evaluateIsCorrectCriteria(criteria)).toEqual(false);
  });
}

function shouldEvaluateIsCorrectCriteriaFalse() {
  it('should evaluate is correct criteria false', () => {
    const componentStates = [{ studentData: { isCorrect: false } }];
    spyOn(dataService, 'getComponentStatesByNodeIdAndComponentId').and.returnValue(componentStates);
    const criteria = {
      params: {
        nodeId: 'node1',
        componentId: 'component1'
      }
    };
    expect(service.evaluateIsCorrectCriteria(criteria)).toEqual(false);
  });
}

function shouldEvaluateIsCorrectCriteriaTrue() {
  it('should evaluate is correct criteria true', () => {
    const componentStates = [{ studentData: { isCorrect: true } }];
    spyOn(dataService, 'getComponentStatesByNodeIdAndComponentId').and.returnValue(componentStates);
    const criteria = {
      params: {
        nodeId: 'node1',
        componentId: 'component1'
      }
    };
    expect(service.evaluateIsCorrectCriteria(criteria)).toEqual(true);
  });
}

function shouldEvaluateBranchPathTakenWhenNoPathsTaken() {
  it('should evaluate branch path taken', () => {
    const branchPathTakenEvents = [];
    spyOn(dataService, 'getBranchPathTakenEventsByNodeId').and.returnValue(branchPathTakenEvents);
    const criteria = {
      params: {
        fromNodeId: 'node1',
        toNodeId: 'node2'
      }
    };
    expect(service.evaluateBranchPathTakenCriteria(criteria)).toEqual(false);
  });
}

function shouldEvaluateBranchPathTakenFalse() {
  it('should evaluate branch path taken false', () => {
    const branchPathTakenEvents = [{ data: { fromNodeId: 'node1', toNodeId: 'node3' } }];
    spyOn(dataService, 'getBranchPathTakenEventsByNodeId').and.returnValue(branchPathTakenEvents);
    const criteria = {
      params: {
        fromNodeId: 'node1',
        toNodeId: 'node2'
      }
    };
    expect(service.evaluateBranchPathTakenCriteria(criteria)).toEqual(false);
  });
}

function shouldEvaluateBranchPathTakenTrue() {
  it('should evaluate branch path taken true', () => {
    const branchPathTakenEvents = [{ data: { fromNodeId: 'node1', toNodeId: 'node2' } }];
    spyOn(dataService, 'getBranchPathTakenEventsByNodeId').and.returnValue(branchPathTakenEvents);
    const criteria = {
      params: {
        fromNodeId: 'node1',
        toNodeId: 'node2'
      }
    };
    expect(service.evaluateBranchPathTakenCriteria(criteria)).toEqual(true);
  });
}

function shouldEvaluateIsVisitedCriteriaFalseWithNoEvents() {
  it('should evaluate is visited criteria with no events', () => {
    const events = [];
    spyOn(dataService, 'getEvents').and.returnValue(events);
    const criteria = {
      params: {
        nodeId: 'node1'
      }
    };
    expect(service.evaluateIsVisitedCriteria(criteria)).toEqual(false);
  });
}

function shouldEvaluateIsVisitedCriteriaFalse() {
  it('should evaluate is visited criteria false', () => {
    const events = [
      { nodeId: 'node1', event: 'nodeEntered' },
      { nodeId: 'node2', event: 'nodeEntered' },
      { nodeId: 'node3', event: 'nodeEntered' }
    ];
    spyOn(dataService, 'getEvents').and.returnValue(events);
    const criteria = {
      params: {
        nodeId: 'node4'
      }
    };
    expect(service.evaluateIsVisitedCriteria(criteria)).toEqual(false);
  });
}

function shouldEvaluateIsVisitedCriteriaTrue() {
  it('should evaluate is visited criteria true', () => {
    const events = [
      { nodeId: 'node1', event: 'nodeEntered' },
      { nodeId: 'node2', event: 'nodeEntered' },
      { nodeId: 'node3', event: 'nodeEntered' }
    ];
    spyOn(dataService, 'getEvents').and.returnValue(events);
    const criteria = {
      params: {
        nodeId: 'node2'
      }
    };
    expect(service.evaluateIsVisitedCriteria(criteria)).toEqual(true);
  });
}

function shouldEvaluateIsVisitedAfterCriteriaFalse() {
  it('should evaluate is visited after criteria false', () => {
    const events = [{ nodeId: 'node1', event: 'nodeEntered', clientSaveTime: 1000 }];
    spyOn(dataService, 'getEvents').and.returnValue(events);
    const criteria = {
      params: {
        isVisitedAfterNodeId: 'node1',
        criteriaCreatedTimestamp: 2000
      }
    };
    expect(service.evaluateIsVisitedAfterCriteria(criteria)).toEqual(false);
  });
}

function shouldEvaluateIsVisitedAfterCriteriaTrue() {
  it('should evaluate is visited after criteria true', () => {
    const events = [
      { nodeId: 'node1', event: 'nodeEntered', clientSaveTime: 1000 },
      { nodeId: 'node1', event: 'nodeEntered', clientSaveTime: 3000 }
    ];
    spyOn(dataService, 'getEvents').and.returnValue(events);
    const criteria = {
      params: {
        isVisitedAfterNodeId: 'node1',
        criteriaCreatedTimestamp: 2000
      }
    };
    expect(service.evaluateIsVisitedAfterCriteria(criteria)).toEqual(true);
  });
}

function shouldEvaluateIsRevisedAfterCriteriaFalseWithNoComponentStates() {
  it('should evaluate is revised after criteria false', () => {
    const componentState = null;
    spyOn(dataService, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(
      componentState
    );
    const criteria = {
      params: {
        isRevisedAfterNodeId: 'node1',
        isRevisedAfterComponentId: 'component1',
        criteriaCreatedTimestamp: 2000
      }
    };
    expect(service.evaluateIsRevisedAfterCriteria(criteria)).toEqual(false);
  });
}

function shouldEvaluateIsRevisedAfterCriteriaFalse() {
  it('should evaluate is revised after criteria false', () => {
    const componentState = { nodeId: 'node1', componentId: 'component1', clientSaveTime: 1000 };
    spyOn(dataService, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(
      componentState
    );
    const criteria = {
      params: {
        isRevisedAfterNodeId: 'node1',
        isRevisedAfterComponentId: 'component1',
        criteriaCreatedTimestamp: 2000
      }
    };
    expect(service.evaluateIsRevisedAfterCriteria(criteria)).toEqual(false);
  });
}

function shouldEvaluateIsRevisedAfterCriteriaTrue() {
  it('should evaluate is revised after criteria true', () => {
    const componentState = { nodeId: 'node1', componentId: 'component1', clientSaveTime: 3000 };
    spyOn(dataService, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(
      componentState
    );
    const criteria = {
      params: {
        isRevisedAfterNodeId: 'node1',
        isRevisedAfterComponentId: 'component1',
        criteriaCreatedTimestamp: 2000
      }
    };
    expect(service.evaluateIsRevisedAfterCriteria(criteria)).toEqual(true);
  });
}

function shouldEvaluateIsVisitedAndRevisedAfterCriteriaFalseWithNoComponentStates() {
  it('should evaluate is visited and revised after criteria false with no component states', () => {
    const events = [{ nodeId: 'node1', event: 'nodeEntered', clientSaveTime: 2000 }];
    spyOn(dataService, 'getEvents').and.returnValue(events);
    const componentState = null;
    spyOn(dataService, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(
      componentState
    );
    const criteria = {
      params: {
        isVisitedAfterNodeId: 'node1',
        isRevisedAfterNodeId: 'node2',
        isRevisedAfterComponentId: 'component2',
        criteriaCreatedTimestamp: 3000
      }
    };
    expect(service.evaluateIsVisitedAndRevisedAfterCriteria(criteria)).toEqual(false);
  });
}

function shouldEvaluateIsVisitedAndRevisedAfterCriteriaFalse() {
  it('should evaluate is visited and revised after criteria false', () => {
    const events = [{ nodeId: 'node1', event: 'nodeEntered', clientSaveTime: 1000 }];
    spyOn(dataService, 'getEvents').and.returnValue(events);
    const componentState = { clientSaveTime: 2000 };
    spyOn(dataService, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(
      componentState
    );
    const criteria = {
      params: {
        isVisitedAfterNodeId: 'node1',
        isRevisedAfterNodeId: 'node2',
        isRevisedAfterComponentId: 'component2',
        criteriaCreatedTimestamp: 3000
      }
    };
    expect(service.evaluateIsVisitedAndRevisedAfterCriteria(criteria)).toEqual(false);
  });
}

function shouldEvaluateIsVisitedAndRevisedAfterCriteriaTrue() {
  it('should evaluate is visited and revised after criteria true', () => {
    const events = [{ nodeId: 'node1', event: 'nodeEntered', clientSaveTime: 4000 }];
    spyOn(dataService, 'getEvents').and.returnValue(events);
    const componentState = { nodeId: 'node2', componentId: 'component2', clientSaveTime: 5000 };
    spyOn(dataService, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(
      componentState
    );
    const criteria = {
      params: {
        isVisitedAfterNodeId: 'node1',
        isRevisedAfterNodeId: 'node2',
        isRevisedAfterComponentId: 'component2',
        criteriaCreatedTimestamp: 3000
      }
    };
    expect(service.evaluateIsVisitedAndRevisedAfterCriteria(criteria)).toEqual(true);
  });
}

function shouldEvaluateIsVisitedAndRevisedAfterCriteriaFalseNoVisitAfter() {
  it('should evaluate is visited and revised after criteria false no visit after', () => {
    const events = [{ nodeId: 'node1', event: 'nodeEntered', clientSaveTime: 1000 }];
    spyOn(dataService, 'getEvents').and.returnValue(events);
    const componentState = { nodeId: 'node2', componentId: 'component2', clientSaveTime: 2000 };
    spyOn(dataService, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(
      componentState
    );
    const criteria = {
      params: {
        isVisitedAfterNodeId: 'node1',
        isRevisedAfterNodeId: 'node2',
        isRevisedAfterComponentId: 'component2',
        criteriaCreatedTimestamp: 3000
      }
    };
    expect(service.evaluateIsVisitedAndRevisedAfterCriteria(criteria)).toEqual(false);
  });
}

function shouldEvaluateIsVisitedAndRevisedAfterCriteriaFalseVisitAfterNoRevise() {
  it('should evaluate is visited and revised after criteria false visit after no revise', () => {
    const events = [{ nodeId: 'node1', event: 'nodeEntered', clientSaveTime: 4000 }];
    spyOn(dataService, 'getEvents').and.returnValue(events);
    const componentState = { nodeId: 'node2', componentId: 'component2', clientSaveTime: 2000 };
    spyOn(dataService, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(
      componentState
    );
    const criteria = {
      params: {
        isVisitedAfterNodeId: 'node1',
        isRevisedAfterNodeId: 'node2',
        isRevisedAfterComponentId: 'component2',
        criteriaCreatedTimestamp: 3000
      }
    };
    expect(service.evaluateIsVisitedAndRevisedAfterCriteria(criteria)).toEqual(false);
  });
}

function shouldEvaluateScoreCriteriaFalse() {
  it('should evaluate score criteria false', () => {
    const criteria = {
      params: {
        nodeId: 'node1',
        componentId: 'component1',
        scores: [1, 2, 3]
      }
    };
    spyOn(configService, 'getWorkgroupId').and.returnValue(1);
    const annotation = {};
    spyOn(annotationService, 'getLatestScoreAnnotation').and.returnValue(annotation);
    spyOn(annotationService, 'getScoreValueFromScoreAnnotation').and.returnValue(4);
    expect(service.evaluateScoreCriteria(criteria)).toEqual(false);
  });
}

function shouldEvaluateScoreCriteriaTrue() {
  it('should evaluate score criteria true', () => {
    const criteria = {
      params: {
        nodeId: 'node1',
        componentId: 'component1',
        scores: [1, 2, 3]
      }
    };
    spyOn(configService, 'getWorkgroupId').and.returnValue(1);
    const annotation = {};
    spyOn(annotationService, 'getLatestScoreAnnotation').and.returnValue(annotation);
    spyOn(annotationService, 'getScoreValueFromScoreAnnotation').and.returnValue(3);
    expect(service.evaluateScoreCriteria(criteria)).toEqual(true);
  });
}

function shouldEvaluateUsedXSubmitsCriteriaFalse() {
  it('should evaluate used x submits criteria false', () => {
    const criteria = {
      params: {
        nodeId: 'node1',
        componentId: 'component1',
        requiredSubmitCount: 2
      }
    };
    const componentStates = [{ studentData: { submitCounter: 1 } }];
    spyOn(dataService, 'getComponentStatesByNodeIdAndComponentId').and.returnValue(componentStates);
    expect(service.evaluateUsedXSubmitsCriteria(criteria)).toEqual(false);
  });
}

function shouldEvaluateUsedXSubmitsCriteriaTrue() {
  it('should evaluate used x submits criteria true', () => {
    const criteria = {
      params: {
        nodeId: 'node1',
        componentId: 'component1',
        requiredSubmitCount: 2
      }
    };
    const componentStates = [{ studentData: { submitCounter: 2 } }];
    spyOn(dataService, 'getComponentStatesByNodeIdAndComponentId').and.returnValue(componentStates);
    expect(service.evaluateUsedXSubmitsCriteria(criteria)).toEqual(true);
  });
}

function shouldEvaluateNumberOfWordsWrittenCriteriaFalse() {
  it('should evaluate number of words written criteria false', () => {
    const criteria = {
      params: {
        nodeId: 'node1',
        componentId: 'component1',
        requiredNumberOfWords: 10
      }
    };
    const componentState = { studentData: { response: 'one two three four five' } };
    spyOn(dataService, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(
      componentState
    );
    spyOn(utilService, 'wordCount').and.returnValue(5);
    expect(service.evaluateNumberOfWordsWrittenCriteria(criteria)).toEqual(false);
  });
}

function shouldEvaluateNumberOfWordsWrittenCriteriaTrue() {
  it('should evaluate number of words written criteria true', () => {
    const criteria = {
      params: {
        nodeId: 'node1',
        componentId: 'component1',
        requiredNumberOfWords: 10
      }
    };
    const componentState = { studentData: { response: '1 2 3 4 5 6 7 8 9 0' } };
    spyOn(dataService, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(
      componentState
    );
    spyOn(utilService, 'wordCount').and.returnValue(10);
    expect(service.evaluateNumberOfWordsWrittenCriteria(criteria)).toEqual(true);
  });
}

function shouldEvaluateAddXNumberOfNotesOnThisStepCriteriaFalse() {
  xit('should evaluate add x number of notes on this step criteria false', () => {
    const criteria = {
      params: {
        nodeId: 'node1',
        requiredNumberOfNotes: 10
      }
    };
    spyOn(notebookService, 'getNotebookByWorkgroup').and.returnValue({
      allItems: [
        { nodeId: 'node1' },
        { nodeId: 'node1' },
        { nodeId: 'node1' },
        { nodeId: 'node1' },
        { nodeId: 'node1' },
        { nodeId: 'node2' },
        { nodeId: 'node2' },
        { nodeId: 'node2' },
        { nodeId: 'node2' },
        { nodeId: 'node2' }
      ]
    });
    expect(service.evaluateAddXNumberOfNotesOnThisStepCriteria(criteria)).toEqual(false);
  });
}

function shouldEvaluateAddXNumberOfNotesOnThisStepCriteriaTrue() {
  xit('should evaluate add x number of notes on this step criteria true', () => {
    const criteria = {
      params: {
        nodeId: 'node1',
        requiredNumberOfNotes: 10
      }
    };
    spyOn(notebookService, 'getNotebookByWorkgroup').and.returnValue({
      allItems: [
        { nodeId: 'node1' },
        { nodeId: 'node1' },
        { nodeId: 'node1' },
        { nodeId: 'node1' },
        { nodeId: 'node1' },
        { nodeId: 'node1' },
        { nodeId: 'node1' },
        { nodeId: 'node1' },
        { nodeId: 'node1' },
        { nodeId: 'node1' }
      ]
    });
    expect(service.evaluateAddXNumberOfNotesOnThisStepCriteria(criteria)).toEqual(true);
  });
}

function shouldEvaluateCriterias() {
  it('should evaluate criterias when it is passed one criteria that is false', () => {
    const criterias = [criteria1];
    spyOn(dataService, 'isCompleted').and.returnValue(false);
    expect(service.evaluateCriterias(criterias)).toEqual(false);
  });
  it('should evaluate criterias when it is passed one criteria that is true', () => {
    const criterias = [criteria1];
    spyOn(dataService, 'isCompleted').and.returnValue(true);
    expect(service.evaluateCriterias(criterias)).toEqual(true);
  });
  it('should evaluate criterias when it is passed multiple criteria false and false', () => {
    const criterias = [criteria1, criteria2];
    spyOn(dataService, 'isCompleted')
      .withArgs('node1')
      .and.returnValue(true)
      .withArgs('node2')
      .and.returnValue(false);
    expect(service.evaluateCriterias(criterias)).toEqual(false);
  });
  it('should evaluate criterias when it is passed multiple criteria false and true', () => {
    const criterias = [criteria1, criteria2];
    spyOn(dataService, 'isCompleted')
      .withArgs('node1')
      .and.returnValue(false)
      .withArgs('node2')
      .and.returnValue(true);
    expect(service.evaluateCriterias(criterias)).toEqual(false);
  });
}
