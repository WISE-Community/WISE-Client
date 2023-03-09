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
let scoreCriteria: any;
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
    scoreCriteria = {
      params: {
        nodeId: 'node1',
        componentId: 'component1',
        scores: [1, 2, 3]
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
  evaluateIsVisitedAndRevisedAfterCriteria();
  evaluateScoreCriteria();
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

function evaluateIsVisitedAndRevisedAfterCriteria() {
  const isVisitedAndRevisedAfterCriteria = {
    params: {
      isVisitedAfterNodeId: 'node1',
      isRevisedAfterNodeId: 'node2',
      isRevisedAfterComponentId: 'component2',
      criteriaCreatedTimestamp: 3000
    }
  };

  function isVisitedAndRevisedAfterCriteriaSpies(events: any[], componentState: any): void {
    spyOn(dataService, 'getEvents').and.returnValue(events);
    spyOn(dataService, 'getLatestComponentStateByNodeIdAndComponentId').and.returnValue(
      componentState
    );
  }
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
    expect(
      service.evaluateIsVisitedAndRevisedAfterCriteria(isVisitedAndRevisedAfterCriteria)
    ).toEqual(expectedValue);
  }
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
  it('should evaluate criterias when it is passed multiple criterias and one is false', () => {
    const criterias = [criteria1, criteria2];
    spyOn(dataService, 'isCompleted')
      .withArgs('node1')
      .and.returnValue(true)
      .withArgs('node2')
      .and.returnValue(false);
    expect(service.evaluateCriterias(criterias)).toEqual(false);
  });
}
