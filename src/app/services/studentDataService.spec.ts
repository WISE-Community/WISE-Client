import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StudentDataService } from '../../assets/wise5/services/studentDataService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { ComponentContent } from '../../assets/wise5/common/ComponentContent';

let $rootScope;
let http: HttpTestingController;
let service: StudentDataService;
let configService: ConfigService;
let annotationService: AnnotationService;
let projectService: ProjectService;

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
  });

  shouldEvaluateIsNodeVisitedAfterTimestampFalse();
  shouldEvaluateIsNodeVisitedAfterTimestampTrue();
  shouldEvaluateHasWorkCreatedAfterTimestampFalse();
  shouldEvaluateHasWorkCreatedAfterTimestampTrue();
  shouldGetBranchPathTakenEventsByNodeId();
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
  shouldCheckIsCompleted();
  shouldGetLatestComponentStatesByNodeId();
  shouldGetLatestComponentStateByNodeId();
  shouldGetStudentWorkById();
  shouldGetMaxScore();
});

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
