import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { Component } from '../../../common/Component';
import { ConceptMapService } from '../conceptMapService';
import { ConceptMapStudent } from './concept-map-student.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let background1 = 'background1.png';
let background2 = 'background2.png';
let backgroundPath1 = '/curriculum/1/assets/background1.png';
let backgroundPath2 = '/curriculum/1/assets/background2.png';
let component: ConceptMapStudent;
let componentId = 'component1';
let fixture: ComponentFixture<ConceptMapStudent>;
let linkId1 = 'link1';
let linkId2 = 'link2';
let linkInstance1;
let linkInstance2;
let linkInstanceId1 = 'studentLink1';
let linkInstanceId2 = 'studentLink2';
let nodeId = 'node1';
let nodeInstance1;
let nodeInstance2;
let nodeInstanceId1 = 'studentNode1';
let nodeInstanceId2 = 'studentNode2';

describe('ConceptMapStudent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [ConceptMapStudent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [MatDialogModule, StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(ConceptMapStudent);
    component = fixture.componentInstance;
    const componentContent = TestBed.inject(ConceptMapService).createComponent();
    componentContent.id = componentId;
    componentContent.prompt = 'Create nodes and links.';
    component.component = new Component(componentContent, nodeId);
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    spyOn(component, 'broadcastDoneRenderingComponent').and.callFake(() => {});
    spyOn(component, 'isAddToNotebookEnabled').and.callFake(() => {
      return true;
    });
    spyOn(component, 'subscribeToNotebookItemChosen').and.callFake(() => {});
    spyOn(component, 'studentDataChanged').and.callFake(() => {});
    nodeInstance1 = createNodeInstance(nodeInstanceId1);
    nodeInstance2 = createNodeInstance(nodeInstanceId2);
    linkInstance1 = createLinkInstance(linkInstanceId1, linkId1, nodeInstanceId1, nodeInstanceId2);
    linkInstance2 = createLinkInstance(linkInstanceId2, linkId2, nodeInstanceId1, nodeInstanceId2);
    fixture.detectChanges();
    const conceptMapData = {
      nodes: [nodeInstance1, nodeInstance2],
      links: [linkInstance1]
    };
    component.populateConceptMapData(conceptMapData);
  });

  addCommentAnnotation();
  addNode();
  addScoreAnnotation();
  checkIfShouldPerformSubmit();
  clearConceptMap();
  createComponentStateObject();
  getBackgroundFileName();
  getConceptMapData();
  getFeedbackFromResult();
  getLinkById();
  getNewConceptMapNodeId();
  getNodeById();
  makeIdsUnique();
  mergeConceptMapComponentState();
  populateNodes();
  populateLinks();
  populateTheStudentWork();
  removeNode();
  setBackground();
  setLinkCurveDown();
  setLinkCurveUp();
  setStudentWork();
});

function createNodeInstance(
  instanceId: string = '',
  originalId: string = '',
  label: string = '',
  fileName: string = '',
  x: number = 0,
  y: number = 0,
  width: number = 100,
  height: number = 100
) {
  return {
    instanceId: instanceId,
    originalId: originalId,
    fileName: fileName,
    label: label,
    x: x,
    y: y,
    width: width,
    height: height
  };
}

function createLinkInstance(
  instanceId: string = '',
  originalId: string = '',
  sourceNodeInstanceId: string = '',
  destinationNodeInstanceId: string = '',
  label: string = '',
  color: string = '',
  curvature: number = 0,
  startCurveUp: boolean = false,
  startCurveDown: boolean = false
) {
  return {
    instanceId: instanceId,
    originalId: originalId,
    color: color,
    label: label,
    sourceNodeInstanceId: sourceNodeInstanceId,
    destinationNodeInstanceId: destinationNodeInstanceId,
    curvature: curvature,
    startCurveUp: startCurveUp,
    startCurveDown: startCurveDown
  };
}

function createComponentState(
  nodeId: string = '',
  componentId: string = '',
  nodes: any[] = [],
  links: any[] = [],
  background: string = '',
  backgroundPath: string = '',
  stretchBackground: boolean = false,
  submitCounter: number = 0
): any {
  return {
    nodeId: nodeId,
    componentId: componentId,
    studentData: {
      conceptMapData: {
        nodes: nodes,
        links: links,
        background: background,
        backgroundPath: backgroundPath,
        stretchBackground: stretchBackground
      },
      submitCounter: submitCounter
    }
  };
}

function createSVGNode(
  id: string = '',
  originalId: string = '',
  filePath: string = '',
  label: string = '',
  x: number = 0,
  y: number = 0,
  width: number = 100,
  height: number = 100,
  showLabel: boolean = true
) {
  return TestBed.inject(ConceptMapService).newConceptMapNode(
    component.draw,
    id,
    originalId,
    filePath,
    label,
    x,
    y,
    width,
    height,
    showLabel
  );
}

function populateNodes() {
  describe('populateNodes', () => {
    it('should populate nodes', () => {
      const conceptMapData = {
        nodes: [nodeInstance1, nodeInstance2]
      };
      component.nodes = [];
      component.populateNodes(conceptMapData);
      expect(component.nodes.length).toEqual(2);
      expect(component.nodes[0].id).toEqual(nodeInstanceId1);
      expect(component.nodes[1].id).toEqual(nodeInstanceId2);
    });
  });
}

function populateLinks() {
  describe('populateLinks', () => {
    it('should populate links', () => {
      const conceptMapData = {
        nodes: [nodeInstance1, nodeInstance2],
        links: [linkInstance1, linkInstance2]
      };
      component.links = [];
      component.populateNodes(conceptMapData);
      component.populateLinks(conceptMapData);
      expect(component.links.length).toEqual(2);
      expect(component.links[0].id).toEqual(linkInstanceId1);
      expect(component.links[1].id).toEqual(linkInstanceId2);
    });
  });
}

function setBackground() {
  describe('setBackground', () => {
    it('should set the background', () => {
      const background = 'background-image.png';
      component.setBackground(background, false);
      expect(component.background).toEqual(background);
    });
    it('should set the background and stretch to fit the whole background', () => {
      const background = 'background-image.png';
      component.setBackground(background, true);
      expect(component.background).toEqual(background);
      expect(component.backgroundSize).toEqual('100% 100%');
    });
  });
}

function setStudentWork() {
  describe('setStudentWork', () => {
    it('should set student work', () => {
      const componentState = createComponentState(
        nodeId,
        componentId,
        [nodeInstance1, nodeInstance2],
        [linkInstance1, linkInstance2],
        null,
        null,
        false,
        1
      );
      component.setStudentWork(componentState);
      expect(component.nodes.length).toEqual(2);
      expect(component.links.length).toEqual(2);
      expect(component.submitCounter).toEqual(1);
    });
  });
}

function checkIfShouldPerformSubmit() {
  describe('checkIfShouldPerformSubmit', () => {
    it('should check if should perform submit when there is no max submit', () => {
      component.componentContent.maxSubmitCount = null;
      expect(component.checkIfShouldPerformSubmit()).toEqual(true);
    });
    it('should check if should perform submit when there are no more submit chances', () => {
      component.componentContent.maxSubmitCount = 1;
      component.submitCounter = 1;
      spyOn(window, 'alert');
      expect(component.checkIfShouldPerformSubmit()).toEqual(false);
      expect(window.alert).toHaveBeenCalledWith(
        'You have no more chances to receive feedback on your answer.'
      );
    });
    it('should check if should perform submit when there is one more submit chance', () => {
      component.componentContent.maxSubmitCount = 2;
      component.submitCounter = 1;
      spyOn(window, 'confirm').and.returnValue(true);
      expect(component.checkIfShouldPerformSubmit()).toEqual(true);
      expect(window.confirm).toHaveBeenCalledWith(
        'You have 1 chance to receive feedback on your answer so this should be your best work.' +
          '\n\nAre you ready to receive feedback on this answer?'
      );
    });
    it(`should check if should perform submit when there is more than one submit chance
        left`, () => {
      component.componentContent.maxSubmitCount = 3;
      component.submitCounter = 1;
      spyOn(window, 'confirm').and.returnValue(true);
      expect(component.checkIfShouldPerformSubmit()).toEqual(true);
      expect(window.confirm).toHaveBeenCalledWith(
        'You have 2 chances to receive feedback on your answer so this this ' +
          'should be your best work.\n\nAre you ready to receive feedback on this answer?'
      );
    });
  });
}

function getFeedbackFromResult() {
  describe('getFeedbackFromResult', () => {
    it('should get feedback from result when there is only a score', () => {
      component.componentContent.showAutoScore = true;
      const score = 5;
      const result = {
        score: score
      };
      const feedback = component.getFeedbackFromResult(result);
      expect(feedback).toEqual(`Score: ${score}`);
    });
    it('should get feedback from result when there is only a feedback', () => {
      component.componentContent.showAutoFeedback = true;
      const feedbackText = 'Good job.';
      const result = {
        feedback: feedbackText
      };
      const feedback = component.getFeedbackFromResult(result);
      expect(feedback).toEqual(`Feedback: ${feedbackText}`);
    });
  });
}

function createComponentStateObject() {
  describe('createComponentStateObject', () => {
    it('should create component state object', () => {
      const conceptMapData = {
        nodes: [nodeInstance1, nodeInstance2],
        links: [linkInstance1]
      };
      component.populateConceptMapData(conceptMapData);
      const componentState = component.createComponentStateObject();
      expect(componentState.componentType).toEqual('ConceptMap');
      expect(componentState.nodeId).toEqual('node1');
      expect(componentState.componentId).toEqual('component1');
      expect(componentState.studentData.conceptMapData.nodes.length).toEqual(2);
      expect(componentState.studentData.conceptMapData.nodes[0].instanceId).toEqual(
        nodeInstanceId1
      );
      expect(componentState.studentData.conceptMapData.nodes[1].instanceId).toEqual(
        nodeInstanceId2
      );
      expect(componentState.studentData.conceptMapData.links.length).toEqual(1);
      expect(componentState.studentData.conceptMapData.links[0].instanceId).toEqual(
        linkInstanceId1
      );
    });
  });
}

function addScoreAnnotation() {
  describe('addScoreAnnotation', () => {
    it('should add score annotation', () => {
      const componentState = createComponentState();
      componentState.annotations = [];
      expect(componentState.annotations.length).toEqual(0);
      component.autoFeedbackResult = {
        score: 5
      };
      component.addScoreAnnotation(componentState, 1, 1, nodeId, componentId, 10);
      expect(componentState.annotations.length).toEqual(1);
    });
  });
}

function addCommentAnnotation() {
  describe('addCommentAnnotation', () => {
    it('should add comment annotation', () => {
      const componentState = createComponentState();
      componentState.annotations = [];
      expect(componentState.annotations.length).toEqual(0);
      component.autoFeedbackResult = {
        feedback: 'Good job.'
      };
      component.addCommentAnnotation(componentState, 1, 1, nodeId, componentId, 10);
      expect(componentState.annotations.length).toEqual(1);
    });
  });
}

function getConceptMapData() {
  describe('getConceptMapData', () => {
    it('should get concept map data', () => {
      const newConceptMapData: any = component.getConceptMapData();
      expect(newConceptMapData.nodes.length).toEqual(2);
      expect(newConceptMapData.links.length).toEqual(1);
    });
  });
}

function getBackgroundFileName() {
  describe('getBackgroundFileName', () => {
    it('should get background file name', () => {
      const fileName = component.getBackgroundFileName('/curriculum/1/assets/my-background.png');
      expect(fileName).toEqual('my-background.png');
    });
  });
}

function getNewConceptMapNodeId() {
  describe('getNewConceptMapNodeId', () => {
    it('should get new concept map node id', () => {
      const newConceptMapNodeId = component.getNewConceptMapNodeId();
      expect(newConceptMapNodeId).toEqual('studentNode3');
    });
  });
}

function addNode() {
  describe('addNode', () => {
    it('should add node', () => {
      const newConceptMapNodeId = component.getNewConceptMapNodeId();
      const svgNode1 = createSVGNode(newConceptMapNodeId);
      component.addNode(svgNode1);
      expect(component.nodes.length).toEqual(3);
      expect(component.nodes[component.nodes.length - 1].id).toEqual(newConceptMapNodeId);
    });
  });
}

function removeNode() {
  describe('removeNode', () => {
    it('should remove node when it has a link attached to it', () => {
      const firstNode = component.nodes[0];
      component.removeNode(firstNode);
      expect(component.nodes.length).toEqual(1);
      expect(component.links.length).toEqual(0);
    });
  });
}

function getNodeById() {
  describe('getNodeById', () => {
    it('should get node by id', () => {
      const node = component.getNodeById(nodeInstanceId1);
      expect(node.id).toEqual(nodeInstanceId1);
    });
  });
}

function getLinkById() {
  describe('getLinkById', () => {
    it('should get link by id', () => {
      const link = component.getLinkById(linkInstanceId1);
      expect(link.id).toEqual(linkInstanceId1);
    });
  });
}

function clearConceptMap() {
  describe('clearConceptMap', () => {
    it('should clear concept map', () => {
      expect(component.nodes.length).toEqual(2);
      expect(component.links.length).toEqual(1);
      component.clearConceptMap();
      expect(component.nodes.length).toEqual(0);
      expect(component.links.length).toEqual(0);
    });
  });
}

function mergeConceptMapComponentState() {
  describe('mergeConceptMapComponentState', () => {
    it('should merge concept map component state', () => {
      const componentState1 = createComponentState(
        nodeId,
        componentId,
        [nodeInstance1, nodeInstance2],
        [linkInstance1],
        background1,
        backgroundPath1,
        false,
        1
      );
      const componentState2 = createComponentState(
        nodeId,
        'component2',
        [nodeInstance1, nodeInstance2],
        [linkInstance1],
        background2,
        backgroundPath2,
        false,
        1
      );
      component.mergeConceptMapComponentState(componentState1, componentState2);
      const conceptMapData = componentState1.studentData.conceptMapData;
      const nodes = conceptMapData.nodes;
      const links = conceptMapData.links;
      expect(nodes.length).toEqual(4);
      expect(links.length).toEqual(2);
      expect(conceptMapData.background).toEqual(background2);
      expect(conceptMapData.backgroundPath).toEqual(backgroundPath2);
    });
  });
}

function makeIdsUnique() {
  describe('makeIdsUnique', () => {
    it('should make ids unique', () => {
      const componentState = createComponentState(
        nodeId,
        componentId,
        [nodeInstance1, nodeInstance2],
        [linkInstance1],
        null,
        null,
        false,
        1
      );
      component.makeIdsUnique(componentState);
      const conceptMapData = componentState.studentData.conceptMapData;
      const nodes = conceptMapData.nodes;
      const links = conceptMapData.links;
      expect(nodes[0].instanceId).toEqual(`${nodeInstanceId1}-${nodeId}-${componentId}`);
      expect(nodes[1].instanceId).toEqual(`${nodeInstanceId2}-${nodeId}-${componentId}`);
      expect(links[0].instanceId).toEqual(`${linkInstanceId1}-${nodeId}-${componentId}`);
      expect(links[0].sourceNodeInstanceId).toEqual(`${nodeInstanceId1}-${nodeId}-${componentId}`);
      expect(links[0].destinationNodeInstanceId).toEqual(
        `${nodeInstanceId2}-${nodeId}-${componentId}`
      );
    });
  });
}

function setLinkCurveUp() {
  describe('setLinkCurveUp', () => {
    it('should set link curve up', () => {
      const link: any = {};
      component.setLinkCurveUp(link);
      expectStartAndEndCurve(link, true);
    });
  });
}

function setLinkCurveDown() {
  describe('setLinkCurveDown', () => {
    it('should set link curve down', () => {
      const link: any = {};
      component.setLinkCurveDown(link);
      expectStartAndEndCurve(link, false);
    });
  });
}

function expectStartAndEndCurve(link: any, isCurveDirectionUp: boolean): void {
  expect(link.startCurveUp).toEqual(isCurveDirectionUp);
  expect(link.endCurveUp).toEqual(isCurveDirectionUp);
}

function populateTheStudentWork() {
  it('should populate the student work', () => {
    const componentState = {
      clientSaveTime: 1542412588000,
      isSubmit: false,
      studentData: {
        conceptMapData: {
          nodes: [
            {
              originalId: 'node1',
              instanceId: 'studentNode1',
              fileName: 'sun.png',
              filePath: '/wise/curriculum/546/assets/sun.png',
              label: 'Sun',
              x: 162,
              y: 68,
              width: 100,
              height: 100,
              outgoingLinks: [
                {
                  originalId: 'link1',
                  instanceId: 'studentLink1',
                  label: 'Solar Radiation'
                }
              ],
              incomingLinks: []
            },
            {
              originalId: 'node2',
              instanceId: 'studentNode2',
              fileName: 'Space.png',
              filePath: '/wise/curriculum/546/assets/Space.png',
              label: 'Space',
              x: 416,
              y: 185,
              width: 100,
              height: 100,
              outgoingLinks: [],
              incomingLinks: [
                {
                  originalId: 'link1',
                  instanceId: 'studentLink1',
                  label: 'Solar Radiation'
                }
              ]
            }
          ],
          links: [
            {
              originalId: 'link1',
              instanceId: 'studentLink1',
              color: '#DDD266',
              label: 'Solar Radiation',
              curvature: 0,
              startCurveUp: false,
              endCurveUp: false,
              sourceNodeOriginalId: 'node1',
              sourceNodeInstanceId: 'studentNode1',
              sourceNodeLabel: 'Sun',
              destinationNodeOriginalId: 'node2',
              destinationNodeInstanceId: 'studentNode2',
              destinationNodeLabel: 'Space'
            }
          ]
        },
        submitCounter: 0
      },
      componentType: 'ConceptMap',
      nodeId: 'node1',
      componentId: 'ut00qpig10'
    };
    const setNodeMouseEventsSpy = spyOn(component, 'setNodeMouseEvents');
    const setLinkMouseEventsSpy = spyOn(component, 'setLinkMouseEvents');
    const moveLinkTextToFrontSpy = spyOn(component, 'moveLinkTextToFront');
    const moveNodesToFrontSpy = spyOn(component, 'moveNodesToFront');
    component.setStudentWork(componentState);
    expect(setNodeMouseEventsSpy).toHaveBeenCalled();
    expect(setLinkMouseEventsSpy).toHaveBeenCalled();
    expect(moveLinkTextToFrontSpy).toHaveBeenCalled();
    expect(moveNodesToFrontSpy).toHaveBeenCalled();
    expect(component.nodes.length).toEqual(2);
    expect(component.links.length).toEqual(1);
  });
}
