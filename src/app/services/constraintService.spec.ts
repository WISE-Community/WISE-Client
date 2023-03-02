import { TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { ConstraintService } from '../../assets/wise5/services/constraintService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentDataService } from '../../assets/wise5/services/studentDataService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { NotebookService } from '../../assets/wise5/services/notebookService';

let annotationService: AnnotationService;
let configService: ConfigService;
let dataService: StudentDataService;
let notebookService: NotebookService;
let service: ConstraintService;
let criteria1: any;
let criteria2: any;
let nodeConstraintTwoRemovalCriteria: any;
let isVisitedEvents: any;
let isVisitedCriteria: any;
let isVisitedAfterCriteria: any;
let isRevisedAfterCriteria: any;
let isVisitedAndRevisedAfterCriteria: any;
let scoreCriteria: any;
let usedXSubmitsCriteria: any;
let numberOfWordsWrittenCriteria: any;
let addXNumberOfNotesOnThisStepCriteria: any;
let addXNumberOfNotesOnThisStepNotebook: any;

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
    nodeConstraintTwoRemovalCriteria = {
      id: 'node3Constraint1',
      action: '',
      targetId: 'node3',
      removalCriteria: [criteria1, criteria2],
      removalConditional: 'all'
    };
    isVisitedEvents = [
      { nodeId: 'node1', event: 'nodeEntered' },
      { nodeId: 'node2', event: 'nodeEntered' },
      { nodeId: 'node3', event: 'nodeEntered' }
    ];
    isVisitedCriteria = {
      params: {
        nodeId: 'node4'
      }
    };
    isVisitedAfterCriteria = {
      params: {
        isVisitedAfterNodeId: 'node1',
        criteriaCreatedTimestamp: 2000
      }
    };
    isRevisedAfterCriteria = {
      params: {
        isVRevisedAfterNodeId: 'node1',
        criteriaCreatedTimestamp: 2000
      }
    };
    isVisitedAndRevisedAfterCriteria = {
      params: {
        isVisitedAfterNodeId: 'node1',
        isRevisedAfterNodeId: 'node2',
        isRevisedAfterComponentId: 'component2',
        criteriaCreatedTimestamp: 3000
      }
    };
    scoreCriteria = {
      params: {
        nodeId: 'node1',
        componentId: 'component1',
        scores: [1, 2, 3]
      }
    };
    usedXSubmitsCriteria = {
      params: {
        nodeId: 'node1',
        componentId: 'component1',
        requiredSubmitCount: 2
      }
    };
    numberOfWordsWrittenCriteria = {
      params: {
        nodeId: 'node1',
        componentId: 'component1',
        requiredNumberOfWords: 10
      }
    };
    addXNumberOfNotesOnThisStepCriteria = {
      params: {
        nodeId: 'node1',
        requiredNumberOfNotes: 10
      }
    };
    addXNumberOfNotesOnThisStepNotebook = {
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
    };
  });

  evaluateNodeConstraintWithOneRemovalCriteria();
  evaluateNodeConstraintWithTwoRemovalCriteria();
  evaluateIsCorrectCriteriaFalseWhenNoComponentStates();
  evaluateIsCorrectCriteria();
  evaluateBranchPathTaken();
  evaluateIsVisitedCriteria();
  evaluateIsVisitedAfterCriteria();
  evaluateIsRevisedAfterCriteria();
  evaluateIsVisitedAndRevisedAfterCriteria();
  evaluateScoreCriteria();
  evaluateUsedXSubmitsCriteria();
  evaluateNumberOfWordsWrittenCriteria();
  evaluateAddXNumberOfNotesOnThisStepCriteria();
  evaluateCriterias();
});

function evaluateNodeConstraintWithOneRemovalCriteria() {
  it('should evaluate node constraint with one removal criteria', () => {
    spyOn(dataService, 'isCompleted').and.returnValue(true);
    const constraint = {
      id: 'node1Constraint1',
      action: '',
      targetId: 'node1',
      removalCriteria: [criteria1],
      removalConditional: 'all'
    };
    expect(service.evaluateNodeConstraint(constraint)).toEqual(true);
  });
}

function evaluateNodeConstraintWithTwoRemovalCriteria() {
  function isCompletedSpy(): void {
    spyOn(dataService, 'isCompleted')
      .withArgs('node1')
      .and.returnValue(true)
      .withArgs('node2')
      .and.returnValue(false);
  }
  it('should evaluate node constraint with two removal criteria requiring all', () => {
    isCompletedSpy();
    expect(service.evaluateNodeConstraint(nodeConstraintTwoRemovalCriteria)).toEqual(false);
  });
  it('should evaluate node constraint with two removal criteria requiring any', () => {
    isCompletedSpy();
    nodeConstraintTwoRemovalCriteria.removalConditional = 'any';
    expect(service.evaluateNodeConstraint(nodeConstraintTwoRemovalCriteria)).toEqual(true);
  });
}

function evaluateIsCorrectCriteriaFalseWhenNoComponentStates() {
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

function evaluateIsCorrectCriteria() {
  const criteria = {
    params: {
      nodeId: 'node1',
      componentId: 'component1'
    }
  };
  it('should evaluate is correct criteria false', () => {
    const componentStates = [{ studentData: { isCorrect: false } }];
    spyOn(dataService, 'getComponentStatesByNodeIdAndComponentId').and.returnValue(componentStates);
    expect(service.evaluateIsCorrectCriteria(criteria)).toEqual(false);
  });
  it('should evaluate is correct criteria true', () => {
    const componentStates = [{ studentData: { isCorrect: true } }];
    spyOn(dataService, 'getComponentStatesByNodeIdAndComponentId').and.returnValue(componentStates);
    expect(service.evaluateIsCorrectCriteria(criteria)).toEqual(true);
  });
}

function evaluateBranchPathTaken() {
  const criteria = {
    params: {
      fromNodeId: 'node1',
      toNodeId: 'node2'
    }
  };
  it('should evaluate branch path taken false', () => {
    const branchPathTakenEvents = [{ data: { fromNodeId: 'node1', toNodeId: 'node3' } }];
    spyOn(dataService, 'getBranchPathTakenEventsByNodeId').and.returnValue(branchPathTakenEvents);
    expect(service.evaluateBranchPathTakenCriteria(criteria)).toEqual(false);
  });
  it('should evaluate branch path taken true', () => {
    const branchPathTakenEvents = [{ data: { fromNodeId: 'node1', toNodeId: 'node2' } }];
    spyOn(dataService, 'getBranchPathTakenEventsByNodeId').and.returnValue(branchPathTakenEvents);
    expect(service.evaluateBranchPathTakenCriteria(criteria)).toEqual(true);
  });
  it('should evaluate branch path taken', () => {
    const branchPathTakenEvents = [];
    spyOn(dataService, 'getBranchPathTakenEventsByNodeId').and.returnValue(branchPathTakenEvents);
    expect(service.evaluateBranchPathTakenCriteria(criteria)).toEqual(false);
  });
}

function evaluateIsVisitedCriteria() {
  it('should evaluate is visited criteria false', () => {
    spyOn(dataService, 'getEvents').and.returnValue(isVisitedEvents);
    expect(service.evaluateIsVisitedCriteria(isVisitedCriteria)).toEqual(false);
  });
  it('should evaluate is visited criteria true', () => {
    spyOn(dataService, 'getEvents').and.returnValue(isVisitedEvents);
    isVisitedCriteria.params.nodeId = 'node2';
    expect(service.evaluateIsVisitedCriteria(isVisitedCriteria)).toEqual(true);
  });
  it('should evaluate is visited criteria with no events', () => {
    const events = [];
    spyOn(dataService, 'getEvents').and.returnValue(events);
    isVisitedCriteria.params.nodeId = 'node1';
    expect(service.evaluateIsVisitedCriteria(isVisitedCriteria)).toEqual(false);
  });
}

function evaluateIsVisitedAfterCriteria() {
  it('should evaluate is visited after criteria false', () => {
    const events = [{ nodeId: 'node1', event: 'nodeEntered', clientSaveTime: 1000 }];
    spyOn(dataService, 'getEvents').and.returnValue(events);
    expect(service.evaluateIsVisitedAfterCriteria(isVisitedAfterCriteria)).toEqual(false);
  });
  it('should evaluate is visited after criteria true', () => {
    const events = [
      { nodeId: 'node1', event: 'nodeEntered', clientSaveTime: 1000 },
      { nodeId: 'node1', event: 'nodeEntered', clientSaveTime: 3000 }
    ];
    spyOn(dataService, 'getEvents').and.returnValue(events);
    expect(service.evaluateIsVisitedAfterCriteria(isVisitedAfterCriteria)).toEqual(true);
  });
}

function evaluateIsRevisedAfterCriteria() {
  it('should evaluate is revised after criteria false', () => {
    const componentState = { nodeId: 'node1', componentId: 'component1', clientSaveTime: 1000 };
    spyOn(dataService, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(
      componentState
    );
    expect(service.evaluateIsRevisedAfterCriteria(isRevisedAfterCriteria)).toEqual(false);
  });
  it('should evaluate is revised after criteria true', () => {
    const componentState = { nodeId: 'node1', componentId: 'component1', clientSaveTime: 3000 };
    spyOn(dataService, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(
      componentState
    );
    expect(service.evaluateIsRevisedAfterCriteria(isRevisedAfterCriteria)).toEqual(true);
  });
  it('should evaluate is revised after criteria false with no componen states', () => {
    const componentState = null;
    spyOn(dataService, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(
      componentState
    );
    expect(service.evaluateIsRevisedAfterCriteria(isRevisedAfterCriteria)).toEqual(false);
  });
}

function evaluateIsVisitedAndRevisedAfterCriteria() {
  function isVisitedAndRevisedAfterCriteriaSpies(events: any[], componentState: any): void {
    spyOn(dataService, 'getEvents').and.returnValue(events);
    spyOn(dataService, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(
      componentState
    );
  }
  it('should evaluate is visited and revised after criteria false', () => {
    const events = [{ nodeId: 'node1', event: 'nodeEntered', clientSaveTime: 1000 }];
    const componentState = { clientSaveTime: 2000 };
    isVisitedAndRevisedAfterCriteriaSpies(events, componentState);
    expect(
      service.evaluateIsVisitedAndRevisedAfterCriteria(isVisitedAndRevisedAfterCriteria)
    ).toEqual(false);
  });
  it('should evaluate is visited and revised after criteria true', () => {
    const events = [{ nodeId: 'node1', event: 'nodeEntered', clientSaveTime: 4000 }];
    const componentState = { nodeId: 'node2', componentId: 'component2', clientSaveTime: 5000 };
    isVisitedAndRevisedAfterCriteriaSpies(events, componentState);
    expect(
      service.evaluateIsVisitedAndRevisedAfterCriteria(isVisitedAndRevisedAfterCriteria)
    ).toEqual(true);
  });
  it('should evaluate is visited and revised after criteria false with no component states', () => {
    const events = [{ nodeId: 'node1', event: 'nodeEntered', clientSaveTime: 2000 }];
    const componentState = null;
    isVisitedAndRevisedAfterCriteriaSpies(events, componentState);
    expect(
      service.evaluateIsVisitedAndRevisedAfterCriteria(isVisitedAndRevisedAfterCriteria)
    ).toEqual(false);
  });
  it('should evaluate is visited and revised after criteria false no visit after', () => {
    const events = [{ nodeId: 'node1', event: 'nodeEntered', clientSaveTime: 1000 }];
    const componentState = { nodeId: 'node2', componentId: 'component2', clientSaveTime: 2000 };
    isVisitedAndRevisedAfterCriteriaSpies(events, componentState);
    expect(
      service.evaluateIsVisitedAndRevisedAfterCriteria(isVisitedAndRevisedAfterCriteria)
    ).toEqual(false);
  });
  it('should evaluate is visited and revised after criteria false visit after no revise', () => {
    const events = [{ nodeId: 'node1', event: 'nodeEntered', clientSaveTime: 4000 }];
    const componentState = { nodeId: 'node2', componentId: 'component2', clientSaveTime: 2000 };
    isVisitedAndRevisedAfterCriteriaSpies(events, componentState);
    expect(
      service.evaluateIsVisitedAndRevisedAfterCriteria(isVisitedAndRevisedAfterCriteria)
    ).toEqual(false);
  });
}

function evaluateScoreCriteria() {
  const annotation = {};
  function scoreCriteriaSpies(returnScore: number): void {
    spyOn(configService, 'getWorkgroupId').and.returnValue(1);
    spyOn(annotationService, 'getLatestScoreAnnotation').and.returnValue(annotation);
    spyOn(annotationService, 'getScoreValueFromScoreAnnotation').and.returnValue(returnScore);
  }
  it('should evaluate score criteria false', () => {
    scoreCriteriaSpies(4);
    expect(service.evaluateScoreCriteria(scoreCriteria)).toEqual(false);
  });
  it('should evaluate score criteria true', () => {
    scoreCriteriaSpies(3);
    expect(service.evaluateScoreCriteria(scoreCriteria)).toEqual(true);
  });
}

function evaluateUsedXSubmitsCriteria() {
  it('should evaluate used x submits criteria false', () => {
    const componentStates = [{ studentData: { submitCounter: 1 } }];
    spyOn(dataService, 'getComponentStatesByNodeIdAndComponentId').and.returnValue(componentStates);
    expect(service.evaluateUsedXSubmitsCriteria(usedXSubmitsCriteria)).toEqual(false);
  });
  it('should evaluate used x submits criteria true', () => {
    const componentStates = [{ studentData: { submitCounter: 2 } }];
    spyOn(dataService, 'getComponentStatesByNodeIdAndComponentId').and.returnValue(componentStates);
    expect(service.evaluateUsedXSubmitsCriteria(usedXSubmitsCriteria)).toEqual(true);
  });
}

function evaluateNumberOfWordsWrittenCriteria() {
  function numberOfWordsWrittenSpies(componentState: any): void {
    spyOn(dataService, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(
      componentState
    );
  }
  it('should evaluate number of words written criteria false', () => {
    const componentState = { studentData: { response: 'one two three four five' } };
    numberOfWordsWrittenSpies(componentState);
    expect(service.evaluateNumberOfWordsWrittenCriteria(numberOfWordsWrittenCriteria)).toEqual(
      false
    );
  });
  it('should evaluate number of words written criteria true', () => {
    const componentState = { studentData: { response: '1 2 3 4 5 6 7 8 9 0' } };
    numberOfWordsWrittenSpies(componentState);
    expect(service.evaluateNumberOfWordsWrittenCriteria(numberOfWordsWrittenCriteria)).toEqual(
      true
    );
  });
}

function evaluateAddXNumberOfNotesOnThisStepCriteria() {
  it('should evaluate add x number of notes on this step criteria false', () => {
    spyOn(notebookService, 'getNotebookByWorkgroup').and.returnValue(
      addXNumberOfNotesOnThisStepNotebook
    );
    expect(
      service.evaluateAddXNumberOfNotesOnThisStepCriteria(addXNumberOfNotesOnThisStepCriteria)
    ).toEqual(false);
  });
  it('should evaluate add x number of notes on this step criteria true', () => {
    addXNumberOfNotesOnThisStepNotebook.allItems.forEach((item) => {
      item.nodeId = 'node1';
    });
    spyOn(notebookService, 'getNotebookByWorkgroup').and.returnValue(
      addXNumberOfNotesOnThisStepNotebook
    );
    expect(
      service.evaluateAddXNumberOfNotesOnThisStepCriteria(addXNumberOfNotesOnThisStepCriteria)
    ).toEqual(true);
  });
}

function evaluateCriterias() {
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
  it('should evaluate criterias when it is passed multiple criteria true and false', () => {
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