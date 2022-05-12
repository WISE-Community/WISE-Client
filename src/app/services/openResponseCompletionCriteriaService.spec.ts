import { TestBed } from '@angular/core/testing';
import {
  CompletionCriteria,
  OpenResponseCompletionCriteriaService
} from '../../assets/wise5/components/openResponse/openResponseCompletionCriteriaService';

let service: OpenResponseCompletionCriteriaService;
let completionCriteria: CompletionCriteria;
const studentData = { componentStates: [], events: [] };

describe('OpenResponseCompletionCriteriaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [OpenResponseCompletionCriteriaService]
    });
    service = TestBed.inject(OpenResponseCompletionCriteriaService);
  });
  isSatisfied();
});

function isSatisfied() {
  describe('isSatisfied()', () => {
    isSatisfied_CompletionCriteriaInOrderFalse();
    isSatisfied_CompletionCriteriaInOrderTrue();
  });
}

function isSatisfied_CompletionCriteriaInOrderFalse() {
  describe('completionCriteria.inOrder is false', () => {
    it('should return false', () => {
      expect(service.isSatisfied(studentData, { inOrder: false, criteria: [] })).toEqual(true);
    });
  });
}

function isSatisfied_CompletionCriteriaInOrderTrue() {
  describe('completionCriteria.inOrder is true', () => {
    beforeEach(() => {
      completionCriteria = {
        criteria: [
          { nodeId: 'n1', componentId: 'c1', name: 'isVisited' },
          { nodeId: 'n1', componentId: 'c1', name: 'isSubmitted' },
          { nodeId: 'n1', componentId: 'c1', name: 'isSaved' }
        ],
        inOrder: true
      };
      studentData.componentStates = [];
      studentData.events = [];
    });
    isSatisfied_CompletionCriteriaInOrderTrueNoWork_ReturnFalse();
    isSatisfied_CompletionCriteriaInOrderTrueOnlySubmit_ReturnFalse();
    isSatisfied_CompletionCriteriaInOrderTrueOnlySave_ReturnFalse();
    isSatisfied_CompletionCriteriaInOrderTrueStudentDataNotInOrder_ReturnFalse();
    isSatisfied_CompletionCriteriaInOrderTrueStudentDataInOrder_ReturnTrue();
  });
}

function isSatisfied_CompletionCriteriaInOrderTrueNoWork_ReturnFalse() {
  it('should return false when studentData contains no work', () => {
    expect(service.isSatisfied(studentData, completionCriteria)).toEqual(false);
  });
}

function isSatisfied_CompletionCriteriaInOrderTrueOnlySubmit_ReturnFalse() {
  it('should return false when studentData contains just submit', () => {
    addSubmitComponentState(1);
    expect(service.isSatisfied(studentData, completionCriteria)).toEqual(false);
  });
}

function isSatisfied_CompletionCriteriaInOrderTrueOnlySave_ReturnFalse() {
  it('should return false when studentData contains just save', () => {
    addSaveComponentState(1);
    expect(service.isSatisfied(studentData, completionCriteria)).toEqual(false);
  });
}

function isSatisfied_CompletionCriteriaInOrderTrueStudentDataNotInOrder_ReturnFalse() {
  it('should return true when studentData contains visit, save, submit but not in order', () => {
    addNodeVisitEvent(3);
    addSubmitComponentState(2);
    addSaveComponentState(1);
    expect(service.isSatisfied(studentData, completionCriteria)).toEqual(false);
  });
}

function isSatisfied_CompletionCriteriaInOrderTrueStudentDataInOrder_ReturnTrue() {
  it('should return true when studentData contains visit, save and submit in order', () => {
    addNodeVisitEvent(1);
    addSubmitComponentState(2);
    addSaveComponentState(3);
    expect(service.isSatisfied(studentData, completionCriteria)).toEqual(true);
  });
}

function addSubmitComponentState(serverSaveTime: number) {
  studentData.componentStates.push({
    nodeId: 'n1',
    componentId: 'c1',
    serverSaveTime: serverSaveTime,
    isSubmit: true
  });
}

function addSaveComponentState(serverSaveTime: number) {
  studentData.componentStates.push({
    nodeId: 'n1',
    componentId: 'c1',
    serverSaveTime: serverSaveTime,
    isSave: true
  });
}

function addNodeVisitEvent(serverSaveTime: number) {
  studentData.events.push({
    nodeId: 'n1',
    serverSaveTime: serverSaveTime,
    event: 'nodeEntered'
  });
}
