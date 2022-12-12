import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StudentDataService } from '../../assets/wise5/services/studentDataService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { UtilService } from '../../assets/wise5/services/utilService';
import { TagService } from '../../assets/wise5/services/tagService';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { ComponentContent } from '../../assets/wise5/common/ComponentContent';

let $injector, $rootScope;
let http: HttpTestingController;
let service: StudentDataService;
let configService: ConfigService;
let annotationService: AnnotationService;
let projectService: ProjectService;
let tagService: TagService;
let utilService: UtilService;
let criteria1: any;
let criteria2: any;

describe('StudentDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule]
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(StudentDataService);
    configService = TestBed.inject(ConfigService);
    annotationService = TestBed.inject(AnnotationService);
    projectService = TestBed.inject(ProjectService);
    tagService = TestBed.inject(TagService);
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
  shouldEvaluateIsNodeVisitedAfterTimestampFalse();
  shouldEvaluateIsNodeVisitedAfterTimestampTrue();
  shouldEvaluateHasWorkCreatedAfterTimestampFalse();
  shouldEvaluateHasWorkCreatedAfterTimestampTrue();
  shouldGetBranchPathTakenEventsByNodeId();
  shouldEvaluateScoreCriteriaFalse();
  shouldEvaluateScoreCriteriaTrue();
  shouldEvaluateUsedXSubmitsCriteriaFalse();
  shouldEvaluateUsedXSubmitsCriteriaTrue();
  shouldEvaluateNumberOfWordsWrittenCriteriaFalse();
  shouldEvaluateNumberOfWordsWrittenCriteriaTrue();
  shouldEvaluateAddXNumberOfNotesOnThisStepCriteriaFalse();
  shouldEvaluateAddXNumberOfNotesOnThisStepCriteriaTrue();
  shouldGetNotebookItemsByNodeId();
  shouldHandleSaveStudentWorkToServerSuccess();
  shouldHandleSaveEventsToServerSuccess();
  shouldHandleSaveAnnotationsToServerSuccess();
  shouldGetLatestComponentState();
  shouldCheckIsComponentSubmitDirty();
  shouldGetLatestComponentStateByNodeIdAndComponentId();
  shouldGetLatestSubmitComponentState();
  shouldGetStudentWorkByStudentWorkId();
  shouldGetComponentStatesByNodeId();
  shouldGetComponentStatesByNodeIdAndComponentId();
  shouldGetEventsByNodeId();
  shouldGetEventsByNodeIdAndComponentId();
  shouldGetLatestNodeEnteredEventNodeIdWithExistingNode();
  shouldCalculateCanVisitNode();
  shouldGetNodeStatusByNodeId();
  shouldGetProgressById();
  shouldCheckIsCompleted();
  shouldGetLatestComponentStatesByNodeId();
  shouldGetLatestComponentStateByNodeId();
  shouldGetStudentWorkById();
  shouldGetMaxScore();
  shouldEvaluateCriterias();
});

function shouldEvaluateNodeConstraintWithOneRemovalCriteria() {
  it('should evaluate node constraint with one removal criteria', () => {
    spyOn(service, 'evaluateCriteria').and.returnValue(true);
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
    spyOn(service, 'evaluateCriteria').and.callFake((criteria) => {
      if (criteria == removalCriteria1) {
        return true;
      } else if (criteria == removalCriteria2) {
        return false;
      }
    });
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
    spyOn(service, 'evaluateCriteria').and.callFake((criteria) => {
      if (criteria == removalCriteria1) {
        return true;
      } else if (criteria == removalCriteria2) {
        return false;
      }
    });
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
    spyOn(service, 'getComponentStatesByNodeIdAndComponentId').and.returnValue(componentStates);
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
    spyOn(service, 'getComponentStatesByNodeIdAndComponentId').and.returnValue(componentStates);
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
    spyOn(service, 'getComponentStatesByNodeIdAndComponentId').and.returnValue(componentStates);
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
    spyOn(service, 'getBranchPathTakenEventsByNodeId').and.returnValue(branchPathTakenEvents);
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
    spyOn(service, 'getBranchPathTakenEventsByNodeId').and.returnValue(branchPathTakenEvents);
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
    spyOn(service, 'getBranchPathTakenEventsByNodeId').and.returnValue(branchPathTakenEvents);
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
    spyOn(service, 'getEvents').and.returnValue(events);
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
    spyOn(service, 'getEvents').and.returnValue(events);
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
    spyOn(service, 'getEvents').and.returnValue(events);
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
    spyOn(service, 'getEvents').and.returnValue(events);
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
    spyOn(service, 'getEvents').and.returnValue(events);
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
    spyOn(service, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(componentState);
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
    spyOn(service, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(componentState);
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
    spyOn(service, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(componentState);
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
    spyOn(service, 'getEvents').and.returnValue(events);
    const componentState = null;
    spyOn(service, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(componentState);
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
    spyOn(service, 'getEvents').and.returnValue(events);
    const componentState = { clientSaveTime: 2000 };
    spyOn(service, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(componentState);
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
    spyOn(service, 'getEvents').and.returnValue(events);
    const componentState = { nodeId: 'node2', componentId: 'component2', clientSaveTime: 5000 };
    spyOn(service, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(componentState);
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
    spyOn(service, 'getEvents').and.returnValue(events);
    const componentState = { nodeId: 'node2', componentId: 'component2', clientSaveTime: 2000 };
    spyOn(service, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(componentState);
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
    spyOn(service, 'getEvents').and.returnValue(events);
    const componentState = { nodeId: 'node2', componentId: 'component2', clientSaveTime: 2000 };
    spyOn(service, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(componentState);
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

function shouldEvaluateIsNodeVisitedAfterTimestampFalse() {
  it('should evaluate is node visited after timestamp', () => {
    const event = { nodeId: 'node1', event: 'nodeEntered', clientSaveTime: 4000 };
    expect(service.isNodeVisitedAfterTimestamp(event, 'node1', 5000)).toEqual(false);
  });
}

function shouldEvaluateIsNodeVisitedAfterTimestampTrue() {
  it('should evaluate is node visited after timestamp', () => {
    const event = { nodeId: 'node1', event: 'nodeEntered', clientSaveTime: 6000 };
    expect(service.isNodeVisitedAfterTimestamp(event, 'node1', 5000)).toEqual(true);
  });
}

function shouldEvaluateHasWorkCreatedAfterTimestampFalse() {
  it('should evaluate has work created after timestamp false', () => {
    const componentState = { nodeId: 'node1', componentId: 'component1', clientSaveTime: 4000 };
    spyOn(service, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(componentState);
    expect(service.hasWorkCreatedAfterTimestamp('node1', 'component1', 5000)).toEqual(false);
  });
}

function shouldEvaluateHasWorkCreatedAfterTimestampTrue() {
  it('should evaluate has work created after timestamp true', () => {
    const componentState = { nodeId: 'node2', componentId: 'component2', clientSaveTime: 6000 };
    spyOn(service, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(componentState);
    expect(service.hasWorkCreatedAfterTimestamp('node1', 'component1', 5000)).toEqual(true);
  });
}

function shouldGetBranchPathTakenEventsByNodeId() {
  it('should get branch path taken events by node id', () => {
    service.studentData = {
      events: [
        { nodeId: 'node1', event: 'branchPathTaken' },
        { nodeId: 'node2', event: 'branchPathTaken' },
        { nodeId: 'node3', event: 'branchPathTaken' }
      ]
    };
    const events = service.getBranchPathTakenEventsByNodeId('node2');
    expect(events.length).toEqual(1);
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
    spyOn(service, 'getComponentStatesByNodeIdAndComponentId').and.returnValue(componentStates);
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
    spyOn(service, 'getComponentStatesByNodeIdAndComponentId').and.returnValue(componentStates);
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
    spyOn(service, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(componentState);
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
    spyOn(service, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(componentState);
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
    spyOn($injector, 'get').and.returnValue({
      getNotebookByWorkgroup: () => {
        return {
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
      }
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
    spyOn($injector, 'get').and.returnValue({
      getNotebookByWorkgroup: () => {
        return {
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
        };
      }
    });
    expect(service.evaluateAddXNumberOfNotesOnThisStepCriteria(criteria)).toEqual(true);
  });
}

function shouldGetNotebookItemsByNodeId() {
  it('should get notebook items by node id', () => {
    const notebook = {
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
    const notebookItems = service.getNotebookItemsByNodeId(notebook, 'node1');
    expect(notebookItems.length).toEqual(5);
    expect(notebookItems[0].nodeId).toEqual('node1');
    expect(notebookItems[1].nodeId).toEqual('node1');
    expect(notebookItems[2].nodeId).toEqual('node1');
    expect(notebookItems[3].nodeId).toEqual('node1');
    expect(notebookItems[4].nodeId).toEqual('node1');
  });
}

function shouldHandleSaveStudentWorkToServerSuccess() {
  xit('should handle save student work to server success', () => {
    service.studentData = {
      componentStates: [
        createComponentState(1, 'node1', 'component1', false, 'a'),
        createComponentState(2, 'node1', 'component1', false, 'b'),
        createComponentState(3, 'node1', 'component1', false, 'c')
      ]
    };
    const savedStudentDataResponse = {
      studentWorkList: [
        createComponentState(1, 'node1', 'component1', false, 'a', 1000),
        createComponentState(2, 'node1', 'component1', false, 'b', 2000),
        createComponentState(3, 'node1', 'component1', false, 'c', 3000)
      ]
    };
    service.handleSaveToServerSuccess(savedStudentDataResponse);
    expect(service.studentData.componentStates[0].serverSaveTime).toEqual(1000);
    expect(service.studentData.componentStates[0].requestToken).toEqual(null);
    expect(service.studentData.componentStates[1].serverSaveTime).toEqual(2000);
    expect(service.studentData.componentStates[1].requestToken).toEqual(null);
    expect(service.studentData.componentStates[2].serverSaveTime).toEqual(3000);
    expect(service.studentData.componentStates[2].requestToken).toEqual(null);
  });
  xit('should handle save student work to server success in preview mode', () => {
    service.studentData = {
      componentStates: [
        createComponentState(null, 'node1', 'component1', false, 'a'),
        createComponentState(null, 'node1', 'component1', false, 'b'),
        createComponentState(null, 'node1', 'component1', false, 'c')
      ]
    };
    const savedStudentDataResponse = {
      studentWorkList: [
        createComponentState(1, 'node1', 'component1', false, 'a', null),
        createComponentState(2, 'node1', 'component1', false, 'b', null),
        createComponentState(3, 'node1', 'component1', false, 'c', null)
      ]
    };
    spyOn(configService, 'getMode').and.returnValue('preview');
    spyOn($rootScope, '$broadcast');
    spyOn(service, 'updateNodeStatuses').and.callFake(() => {});
    service.saveToServerRequestCount = 1;
    service.handleSaveToServerSuccess(savedStudentDataResponse);
    expect(service.studentData.componentStates[0].serverSaveTime).toBeDefined();
    expect(service.studentData.componentStates[0].requestToken).toEqual(null);
    expect(service.studentData.componentStates[0].id).toEqual(1);
    expect(service.studentData.componentStates[1].serverSaveTime).toBeDefined();
    expect(service.studentData.componentStates[1].requestToken).toEqual(null);
    expect(service.studentData.componentStates[1].id).toEqual(2);
    expect(service.studentData.componentStates[2].serverSaveTime).toBeDefined();
    expect(service.studentData.componentStates[2].requestToken).toEqual(null);
    expect(service.studentData.componentStates[2].id).toEqual(3);
    expect($rootScope.$broadcast).toHaveBeenCalledWith(
      'studentWorkSavedToServer',
      jasmine.any(Object)
    );
    expect(service.saveToServerRequestCount).toEqual(0);
    expect(service.updateNodeStatuses).toHaveBeenCalled();
  });
}

function createComponentState(
  id,
  nodeId,
  componentId,
  isSubmit = true,
  requestToken = 'abc',
  serverSaveTime = 123
) {
  return {
    id: id,
    nodeId: nodeId,
    componentId: componentId,
    isSubmit: isSubmit,
    requestToken: requestToken,
    serverSaveTime: serverSaveTime
  };
}

function shouldHandleSaveEventsToServerSuccess() {
  xit('should handle save events to server success', () => {
    service.studentData = {
      events: [
        createEvent(1, 'node1', 'component1', 'nodeEntered', 'a'),
        createEvent(2, 'node1', 'component1', 'nodeEntered', 'b'),
        createEvent(3, 'node1', 'component1', 'nodeEntered', 'c')
      ]
    };
    const savedStudentDataResponse = {
      events: [
        createEvent(1, 'node1', 'component1', 'nodeEntered', 'a', 1000),
        createEvent(2, 'node1', 'component1', 'nodeEntered', 'b', 2000),
        createEvent(3, 'node1', 'component1', 'nodeEntered', 'c', 3000)
      ]
    };
    spyOn($rootScope, '$broadcast');
    spyOn(service, 'updateNodeStatuses').and.callFake(() => {});
    service.saveToServerRequestCount = 1;
    service.handleSaveToServerSuccess(savedStudentDataResponse);
    expect(service.studentData.events[0].serverSaveTime).toEqual(1000);
    expect(service.studentData.events[0].requestToken).toEqual(null);
    expect(service.studentData.events[1].serverSaveTime).toEqual(2000);
    expect(service.studentData.events[1].requestToken).toEqual(null);
    expect(service.studentData.events[2].serverSaveTime).toEqual(3000);
    expect(service.studentData.events[2].requestToken).toEqual(null);
    expect(service.saveToServerRequestCount).toEqual(0);
    expect(service.updateNodeStatuses).toHaveBeenCalled();
  });
}

function createEvent(
  id,
  nodeId,
  componentId,
  event = '',
  requestToken = 'abc',
  serverSaveTime = 123
) {
  return {
    id: id,
    nodeId: nodeId,
    componentId: componentId,
    event: event,
    requestToken: requestToken,
    serverSaveTime: serverSaveTime
  };
}

function shouldHandleSaveAnnotationsToServerSuccess() {
  xit('should handle save annotations to server success', () => {
    service.studentData = {
      annotations: [createAnnotation(1, 'a'), createAnnotation(2, 'b'), createAnnotation(3, 'c')]
    };
    const savedStudentDataResponse = {
      annotations: [
        createAnnotation(1, 'a', 1000),
        createAnnotation(2, 'b', 2000),
        createAnnotation(3, 'c', 3000)
      ]
    };
    spyOn(annotationService, 'broadcastAnnotationSavedToServer');
    spyOn(service, 'updateNodeStatuses').and.callFake(() => {});
    service.saveToServerRequestCount = 1;
    service.handleSaveToServerSuccess(savedStudentDataResponse);
    expect(service.studentData.annotations[0].serverSaveTime).toEqual(1000);
    expect(service.studentData.annotations[0].requestToken).toEqual(null);
    expect(service.studentData.annotations[1].serverSaveTime).toEqual(2000);
    expect(service.studentData.annotations[1].requestToken).toEqual(null);
    expect(service.studentData.annotations[2].serverSaveTime).toEqual(3000);
    expect(service.studentData.annotations[2].requestToken).toEqual(null);
    expect(annotationService.broadcastAnnotationSavedToServer).toHaveBeenCalledWith(
      jasmine.any(Object)
    );
    expect(service.saveToServerRequestCount).toEqual(0);
    expect(service.updateNodeStatuses).toHaveBeenCalled();
  });
}

function createAnnotation(id, requestToken, serverSaveTime = 123) {
  return {
    id: id,
    requestToken: requestToken,
    serverSaveTime: serverSaveTime
  };
}

function shouldGetLatestComponentState() {
  it('should get latest component state when there are none', () => {
    service.studentData = {
      componentStates: []
    };
    const latestComponentState = service.getLatestComponentState();
    expect(latestComponentState).toBeNull();
  });
  it('should get latest component state when there is one', () => {
    service.studentData = {
      componentStates: [{ id: 100 }]
    };
    const latestComponentState = service.getLatestComponentState();
    expect(latestComponentState.id).toEqual(100);
  });
  it('should get latest component state when there are many', () => {
    service.studentData = {
      componentStates: [{ id: 100 }, { id: 101 }, { id: 102 }]
    };
    const latestComponentState = service.getLatestComponentState();
    expect(latestComponentState.id).toEqual(102);
  });
}

function shouldCheckIsComponentSubmitDirty() {
  it('should check is component submit dirty false', () => {
    const componentState = { id: 100, isSubmit: false };
    spyOn(service, 'getLatestComponentState').and.returnValue(componentState);
    expect(service.isComponentSubmitDirty()).toEqual(true);
  });
  it('should check is component submit dirty true', () => {
    const componentState = { id: 100, isSubmit: true };
    spyOn(service, 'getLatestComponentState').and.returnValue(componentState);
    expect(service.isComponentSubmitDirty()).toEqual(false);
  });
}

function shouldGetLatestComponentStateByNodeIdAndComponentId() {
  it('should get latest component state by node id and component id when there is none', () => {
    service.studentData = {
      componentStates: [
        createComponentState(1, 'node1', 'component1'),
        createComponentState(2, 'node1', 'component2'),
        createComponentState(3, 'node2', 'component3')
      ]
    };
    const componentState = service.getLatestComponentStateByNodeIdAndComponentId(
      'node1',
      'component3'
    );
    expect(componentState).toEqual(null);
  });
  it('should get latest component state by node id and component id with no component id', () => {
    service.studentData = {
      componentStates: [
        createComponentState(1, 'node1', 'component1'),
        createComponentState(2, 'node1', 'component2'),
        createComponentState(3, 'node2', 'component3')
      ]
    };
    const componentState = service.getLatestComponentStateByNodeIdAndComponentId('node1');
    expect(componentState.id).toEqual(2);
    expect(componentState.nodeId).toEqual('node1');
    expect(componentState.componentId).toEqual('component2');
  });
  it('should get latest component state by node id and component id', () => {
    service.studentData = {
      componentStates: [
        createComponentState(1, 'node1', 'component1'),
        createComponentState(2, 'node1', 'component2'),
        createComponentState(3, 'node2', 'component3')
      ]
    };
    const componentState = service.getLatestComponentStateByNodeIdAndComponentId(
      'node1',
      'component1'
    );
    expect(componentState.id).toEqual(1);
    expect(componentState.nodeId).toEqual('node1');
    expect(componentState.componentId).toEqual('component1');
  });
}

function shouldGetLatestSubmitComponentState() {
  it('should get latest submit component state when there is none', () => {
    service.studentData = {
      componentStates: [
        createComponentState(1, 'node1', 'component1', false),
        createComponentState(2, 'node2', 'component2', false),
        createComponentState(3, 'node3', 'component3', false)
      ]
    };
    const componentState = service.getLatestSubmitComponentState('node1', 'component1');
    expect(componentState).toEqual(null);
  });
  it('should get latest submit component state when there is one', () => {
    service.studentData = {
      componentStates: [
        createComponentState(1, 'node1', 'component1', false),
        createComponentState(2, 'node1', 'component1', true),
        createComponentState(3, 'node1', 'component1', false)
      ]
    };
    const componentState = service.getLatestSubmitComponentState('node1', 'component1');
    expect(componentState.id).toEqual(2);
  });
  it('should get latest submit component state when there is two', () => {
    service.studentData = {
      componentStates: [
        createComponentState(1, 'node1', 'component1', true),
        createComponentState(2, 'node1', 'component1', false),
        createComponentState(3, 'node1', 'component1', true)
      ]
    };
    const componentState = service.getLatestSubmitComponentState('node1', 'component1');
    expect(componentState.id).toEqual(3);
  });
}

function shouldGetStudentWorkByStudentWorkId() {
  it('should get student work by student work id with an id that does not exist', () => {
    service.studentData = {
      componentStates: [
        createComponentState(1, 'node1', 'component1'),
        createComponentState(2, 'node2', 'component2'),
        createComponentState(3, 'node3', 'component3')
      ]
    };
    const componentState = service.getStudentWorkByStudentWorkId(4);
    expect(componentState).toEqual(null);
  });
  it('should get student work by student work id with an id that does exist', () => {
    service.studentData = {
      componentStates: [
        createComponentState(1, 'node1', 'component1'),
        createComponentState(2, 'node1', 'component1'),
        createComponentState(3, 'node1', 'component1')
      ]
    };
    const componentState = service.getStudentWorkByStudentWorkId(2);
    expect(componentState.id).toEqual(2);
  });
}

function shouldGetComponentStatesByNodeId() {
  it('should get component states by node id', () => {
    service.studentData = {
      componentStates: [
        createComponentState(1, 'node1', 'component1'),
        createComponentState(2, 'node1', 'component2'),
        createComponentState(3, 'node2', 'component3'),
        createComponentState(4, 'node3', 'component4'),
        createComponentState(5, 'node1', 'component5')
      ]
    };
    const componentStates = service.getComponentStatesByNodeId('node1');
    expect(componentStates.length).toEqual(3);
    expect(componentStates[0].id).toEqual(1);
    expect(componentStates[1].id).toEqual(2);
    expect(componentStates[2].id).toEqual(5);
  });
}

function shouldGetComponentStatesByNodeIdAndComponentId() {
  it('should get component states by node id and component id', () => {
    service.studentData = {
      componentStates: [
        createComponentState(1, 'node1', 'component1'),
        createComponentState(2, 'node1', 'component2'),
        createComponentState(3, 'node2', 'component3'),
        createComponentState(4, 'node3', 'component4'),
        createComponentState(5, 'node1', 'component1')
      ]
    };
    const componentStates = service.getComponentStatesByNodeIdAndComponentId('node1', 'component1');
    expect(componentStates.length).toEqual(2);
    expect(componentStates[0].id).toEqual(1);
    expect(componentStates[1].id).toEqual(5);
  });
}

function shouldGetEventsByNodeId() {
  it('should get events by node id', () => {
    service.studentData = {
      events: [
        createEvent(1, 'node1', 'component1'),
        createEvent(2, 'node1', 'component2'),
        createEvent(3, 'node2', 'component3'),
        createEvent(4, 'node3', 'component4'),
        createEvent(5, 'node1', 'component1')
      ]
    };
    const events = service.getEventsByNodeId('node1');
    expect(events.length).toEqual(3);
    expect(events[0].id).toEqual(1);
    expect(events[1].id).toEqual(2);
    expect(events[2].id).toEqual(5);
  });
}

function shouldGetEventsByNodeIdAndComponentId() {
  it('should get events by node id and component id', () => {
    service.studentData = {
      events: [
        createEvent(1, 'node1', 'component1'),
        createEvent(2, 'node1', 'component2'),
        createEvent(3, 'node2', 'component3'),
        createEvent(4, 'node3', 'component4'),
        createEvent(5, 'node1', 'component1')
      ]
    };
    const events = service.getEventsByNodeIdAndComponentId('node1', 'component1');
    expect(events.length).toEqual(2);
    expect(events[0].id).toEqual(1);
    expect(events[1].id).toEqual(5);
  });
}

function shouldGetLatestNodeEnteredEventNodeIdWithExistingNode() {
  it('should get latest node entered event node id with existing node', () => {
    service.studentData = {
      events: [
        createEvent(1, 'node1', 'component1', 'nodeEntered'),
        createEvent(2, 'node1', 'component2', 'nodeEntered'),
        createEvent(3, 'node2', 'component3', 'nodeEntered'),
        createEvent(4, 'node3', 'component4', 'nodeEntered'),
        createEvent(5, 'node1', 'component1', 'nodeEntered')
      ]
    };
    spyOn(projectService, 'getNodeById').and.callFake((nodeId) => {
      return {
        id: nodeId
      };
    });
    spyOn(projectService, 'isActive').and.callFake((nodeId) => {
      return nodeId === 'node1';
    });
    const nodeId = service.getLatestNodeEnteredEventNodeIdWithExistingNode();
    expect(nodeId).toEqual('node1');
  });
}

function shouldCalculateCanVisitNode() {
  it('should calculate can visit node false', () => {
    service.nodeStatuses = {
      node1: { nodeId: 'node1', isVisitable: false },
      node2: { nodeId: 'node2', isVisitable: true },
      node3: { nodeId: 'node3', isVisitable: true }
    };
    const nodeStatus = service.getNodeStatusByNodeId('node1');
    expect(nodeStatus.isVisitable).toEqual(false);
  });
  it('should calculate can visit node true', () => {
    service.nodeStatuses = {
      node1: { nodeId: 'node1', isVisitable: false },
      node2: { nodeId: 'node2', isVisitable: true },
      node3: { nodeId: 'node3', isVisitable: true }
    };
    const nodeStatus = service.getNodeStatusByNodeId('node2');
    expect(nodeStatus.isVisitable).toEqual(true);
  });
}

function shouldGetNodeStatusByNodeId() {
  it('should get node status by node id', () => {
    service.nodeStatuses = {
      node1: { nodeId: 'node1' },
      node2: { nodeId: 'node2' },
      node3: { nodeId: 'node3' }
    };
    const nodeStatus = service.getNodeStatusByNodeId('node1');
    expect(nodeStatus.nodeId).toEqual('node1');
  });
}

function shouldGetProgressById() {
  it('should get progress by id with child step nodes', () => {
    service.nodeStatuses = {
      node1: { nodeId: 'node1', isVisible: true, isCompleted: true },
      node2: { nodeId: 'node2', isVisible: true, isCompleted: false }
    };
    spyOn(projectService, 'isGroupNode').and.callFake((nodeId) => {
      return nodeId.startsWith('group');
    });
    const childNodeIds = ['node1', 'node2'];
    spyOn(projectService, 'getChildNodeIdsById').and.returnValue(childNodeIds);
    spyOn(projectService, 'nodeHasWork').and.returnValue(true);
    const progress: any = service.getNodeProgressById('group1');
    expect(progress.completedItems).toEqual(1);
    expect(progress.completedItemsWithWork).toEqual(1);
    expect(progress.totalItems).toEqual(2);
    expect(progress.totalItemsWithWork).toEqual(2);
    expect(progress.completionPct).toEqual(50);
    expect(progress.completionPctWithWork).toEqual(50);
  });
  it('should get progress by id with child group nodes', () => {
    service.nodeStatuses = {
      group1: {
        nodeId: 'group1',
        progress: {
          completedItems: 1,
          totalItems: 1,
          completedItemsWithWork: 1,
          totalItemsWithWork: 1
        }
      },
      group2: {
        nodeId: 'group2',
        progress: {
          completedItems: 2,
          totalItems: 2,
          completedItemsWithWork: 2,
          totalItemsWithWork: 2
        }
      }
    };
    spyOn(projectService, 'isGroupNode').and.callFake((nodeId) => {
      return nodeId.startsWith('group');
    });
    const childNodeIds = ['group1', 'group2'];
    spyOn(projectService, 'getChildNodeIdsById').and.returnValue(childNodeIds);
    const progress: any = service.getNodeProgressById('group0');
    expect(progress.completedItems).toEqual(3);
    expect(progress.completedItemsWithWork).toEqual(3);
    expect(progress.totalItems).toEqual(3);
    expect(progress.totalItemsWithWork).toEqual(3);
    expect(progress.completionPct).toEqual(100);
    expect(progress.completionPctWithWork).toEqual(100);
  });
}

function shouldCheckIsCompleted() {
  xit('should check a component is completed false', () => {
    const componentStates = [];
    spyOn(service, 'getComponentStatesByNodeIdAndComponentId').and.returnValue(componentStates);
    const componentEvents = [];
    spyOn(service, 'getEventsByNodeIdAndComponentId').and.returnValue(componentEvents);
    const nodeEvents = [];
    spyOn(service, 'getEventsByNodeId').and.returnValue(nodeEvents);
    const component = { id: 'component1', type: 'OpenResponse' } as ComponentContent;
    spyOn(projectService, 'getComponent').and.returnValue(component);
    const node = { id: 'node1' };
    spyOn(projectService, 'getNodeById').and.returnValue(node);
    expect(service.isCompleted('node1', 'component1')).toEqual(false);
  });
  xit('should check a component is completed true', () => {
    const componentStates = [{ studentData: { response: 'Hello World' } }];
    spyOn(service, 'getComponentStatesByNodeIdAndComponentId').and.returnValue(componentStates);
    const componentEvents = [];
    spyOn(service, 'getEventsByNodeIdAndComponentId').and.returnValue(componentEvents);
    const nodeEvents = [];
    spyOn(service, 'getEventsByNodeId').and.returnValue(nodeEvents);
    const component = { id: 'component1', type: 'OpenResponse' } as ComponentContent;
    spyOn(projectService, 'getComponent').and.returnValue(component);
    const node = { id: 'node1' };
    spyOn(projectService, 'getNodeById').and.returnValue(node);
    expect(service.isCompleted('node1', 'component1')).toEqual(true);
  });
  xit('should check a step node is completed false', () => {
    spyOn(projectService, 'isGroupNode').and.returnValue(false);
    const node = {};
    spyOn(projectService, 'getNodeById').and.returnValue(node);
    const components = [
      { id: 'component1', type: 'OpenResponse' },
      { id: 'component2', type: 'OpenResponse' }
    ] as ComponentContent[];
    spyOn(projectService, 'getComponents').and.returnValue(components);
    spyOn(service, 'getComponentStatesByNodeIdAndComponentId').and.callFake(
      (nodeId, componentId) => {
        if (nodeId === 'node1' && componentId === 'component1') {
          return [{ studentData: { response: 'Hello World' } }];
        } else if (nodeId === 'node1' && componentId === 'component2') {
          return [];
        }
      }
    );
    const componentEvents = [];
    spyOn(service, 'getEventsByNodeIdAndComponentId').and.returnValue(componentEvents);
    const nodeEvents = [];
    spyOn(service, 'getEventsByNodeId').and.returnValue(nodeEvents);
    expect(service.isCompleted('node1')).toEqual(false);
  });
  xit('should check a step node is completed true', () => {
    spyOn(projectService, 'isGroupNode').and.returnValue(false);
    const node = {};
    spyOn(projectService, 'getNodeById').and.returnValue(node);
    const components = [
      { id: 'component1', type: 'OpenResponse' },
      { id: 'component2', type: 'OpenResponse' }
    ] as ComponentContent[];
    spyOn(projectService, 'getComponents').and.returnValue(components);
    spyOn(service, 'getComponentStatesByNodeIdAndComponentId').and.callFake(
      (nodeId, componentId) => {
        if (nodeId === 'node1' && componentId === 'component1') {
          return [{ studentData: { response: 'Hello World' } }];
        } else if (nodeId === 'node1' && componentId === 'component2') {
          return [{ studentData: { response: 'Hello World2' } }];
        }
      }
    );
    const componentEvents = [];
    spyOn(service, 'getEventsByNodeIdAndComponentId').and.returnValue(componentEvents);
    const nodeEvents = [];
    spyOn(service, 'getEventsByNodeId').and.returnValue(nodeEvents);
    expect(service.isCompleted('node1')).toEqual(true);
  });
  it('should check a group node is completed false', () => {
    spyOn(projectService, 'isGroupNode').and.returnValue(true);
    const node = {};
    spyOn(projectService, 'getNodeById').and.returnValue(node);
    const nodeIds = ['node1', 'node2'];
    spyOn(projectService, 'getChildNodeIdsById').and.returnValue(nodeIds);
    service.nodeStatuses = {
      node1: {
        isVisible: true,
        isCompleted: true
      },
      node2: {
        isVisible: true,
        isCompleted: false
      }
    };
    expect(service.isCompleted('node1')).toEqual(false);
  });
  it('should check a group node is completed true', () => {
    spyOn(projectService, 'isGroupNode').and.returnValue(true);
    const node = {};
    spyOn(projectService, 'getNodeById').and.returnValue(node);
    const nodeIds = ['node1', 'node2'];
    spyOn(projectService, 'getChildNodeIdsById').and.returnValue(nodeIds);
    service.nodeStatuses = {
      node1: {
        isVisible: true,
        isCompleted: true
      },
      node2: {
        isVisible: true,
        isCompleted: true
      }
    };
    expect(service.isCompleted('node1')).toEqual(true);
  });
}

function shouldGetLatestComponentStatesByNodeId() {
  it('should get latest component states by node id', () => {
    const node = { components: [{ id: 'component1' }, { id: 'component2' }] };
    spyOn(projectService, 'getNodeById').and.returnValue(node);
    service.studentData = {
      componentStates: [{ id: 1, nodeId: 'node1', componentId: 'component1' }]
    };
    const componentStates = service.getLatestComponentStatesByNodeId('node1');
    expect(componentStates.length).toEqual(2);
    expect(componentStates[0].id).toEqual(1);
    expect(componentStates[0].nodeId).toEqual('node1');
    expect(componentStates[0].componentId).toEqual('component1');
    expect(componentStates[1].id).toBeUndefined();
    expect(componentStates[1].nodeId).toEqual('node1');
    expect(componentStates[1].componentId).toEqual('component2');
  });
}

function shouldGetLatestComponentStateByNodeId() {
  it('should get latest component state by node id', () => {
    service.studentData = {
      componentStates: [
        { id: 1, nodeId: 'node1', componentId: 'component1' },
        { id: 2, nodeId: 'node1', componentId: 'component2' }
      ]
    };
    const componentState = service.getLatestComponentStateByNodeId('node1');
    expect(componentState.id).toEqual(2);
  });
}

function shouldGetStudentWorkById() {
  it('should get student work by id', () => {
    spyOn(configService, 'getRunId').and.returnValue(1);
    spyOn(configService, 'getConfigParam').withArgs('studentDataURL').and.returnValue('/student');
    service.getStudentWorkById(1000);
    http
      .expectOne(
        '/student?runId=1&id=1000&getStudentWork=true&getEvents=false&' +
          'getAnnotations=false&onlyGetLatest=true'
      )
      .flush({ studentWorkList: [] });
  });
}

function shouldGetMaxScore() {
  it('should get max score', () => {
    service.nodeStatuses = {
      node1: {
        nodeId: 'node1',
        isVisible: true
      },
      node2: {
        nodeId: 'node2',
        isVisible: true
      },
      node3: {
        nodeId: 'node3',
        isVisible: true
      }
    };
    spyOn(projectService, 'isGroupNode').and.callFake((nodeId) => {
      return nodeId.startsWith('group');
    });
    spyOn(projectService, 'getMaxScoreForNode').and.callFake((nodeId) => {
      if (nodeId === 'node1') {
        return 1;
      } else if (nodeId === 'node2') {
        return 2;
      } else if (nodeId === 'node3') {
        return 3;
      }
    });
    expect(service.getMaxScore()).toEqual(6);
  });
}

function shouldEvaluateCriterias() {
  it('should evaluate criterias when it is passed one criteria that is false', () => {
    const criterias = [criteria1];
    spyOn(service, 'evaluateCriteria').and.callFake(() => {
      return false;
    });
    expect(service.evaluateCriterias(criterias)).toEqual(false);
  });
  it('should evaluate criterias when it is passed one criteria that is true', () => {
    const criterias = [criteria1];
    spyOn(service, 'evaluateCriteria').and.callFake(() => {
      return true;
    });
    expect(service.evaluateCriterias(criterias)).toEqual(true);
  });
  it('should evaluate criterias when it is passed multiple criteria false and false', () => {
    const criterias = [criteria1, criteria2];
    spyOn(service, 'evaluateCriteria').and.callFake((criteria) => {
      if (criteria === criteria1) {
        return false;
      } else if (criteria === criteria2) {
        return false;
      }
    });
    expect(service.evaluateCriterias(criterias)).toEqual(false);
  });
  it('should evaluate criterias when it is passed multiple criteria false and true', () => {
    const criterias = [criteria1, criteria2];
    spyOn(service, 'evaluateCriteria').and.callFake((criteria) => {
      if (criteria === criteria1) {
        return false;
      } else if (criteria === criteria2) {
        return true;
      }
    });
    expect(service.evaluateCriterias(criterias)).toEqual(false);
  });
  it('should evaluate criterias when it is passed multiple criteria true and false', () => {
    const criterias = [criteria1, criteria2];
    spyOn(service, 'evaluateCriteria').and.callFake((criteria) => {
      if (criteria === criteria1) {
        return true;
      } else if (criteria === criteria2) {
        return false;
      }
    });
    expect(service.evaluateCriterias(criterias)).toEqual(false);
  });
  it('should evaluate criterias when it is passed multiple criteria true and true', () => {
    const criterias = [criteria1, criteria2];
    spyOn(service, 'evaluateCriteria').and.callFake((criteria) => {
      if (criteria === criteria1) {
        return true;
      } else if (criteria === criteria2) {
        return true;
      }
    });
    expect(service.evaluateCriterias(criterias)).toEqual(true);
  });
}
