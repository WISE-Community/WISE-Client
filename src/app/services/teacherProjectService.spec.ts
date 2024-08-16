import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { ConfigService } from '../../assets/wise5/services/configService';
import demoProjectJSON_import from './sampleData/curriculum/Demo.project.json';
import scootersProjectJSON_import from './sampleData/curriculum/SelfPropelledVehiclesChallenge.project.json';
import teacherProjctJSON_import from './sampleData/curriculum/TeacherProjectServiceSpec.project.json';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { copy } from '../../assets/wise5/common/object/object';
import { DeleteNodeService } from '../../assets/wise5/services/deleteNodeService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
let service: TeacherProjectService;
let configService: ConfigService;
let deleteNodeService: DeleteNodeService;
let http: HttpTestingController;
let demoProjectJSON: any;
let scootersProjectJSON: any;
let teacherProjectJSON: any;

const scootersProjectJSONString = JSON.stringify(demoProjectJSON_import);
const scootersProjectName = 'scooters';
const projectIdDefault = 1;
const projectBaseURL = 'http://localhost:8080/curriculum/12345/';
const projectURL = projectBaseURL + 'project.json';
const registerNewProjectURL = 'http://localhost:8080/wise/project/new';
const saveProjectURL = 'http://localhost:8080/wise/project/save/' + projectIdDefault;
const wiseBaseURL = '/wise';
describe('TeacherProjectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StudentTeacherCommonServicesModule],
      providers: [
        DeleteNodeService,
        TeacherProjectService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TeacherProjectService);
    configService = TestBed.inject(ConfigService);
    deleteNodeService = TestBed.inject(DeleteNodeService);
    demoProjectJSON = copy(demoProjectJSON_import);
    scootersProjectJSON = copy(scootersProjectJSON_import);
    teacherProjectJSON = copy(teacherProjctJSON_import);
    service.project = {
      nodes: [],
      inactiveNodes: []
    };
    service.applicationNodes = [];
  });
  registerNewProject();
  isNodeIdUsed();
  isNodeIdToInsertTargetNotSpecified();
  testGetNodeIdAfter();
  testCreateNodeAfter();
  shouldGetTheBranchLetter();
  lockNode();
  unlockNode();
  getNextAvailableNodeId();
  shouldReturnTheNextAvailableGroupId();
  shouldReturnTheGroupIdsInTheProject();
  shouldReturnTheMaxScoreOfTheProject();
  shouldNotAddSpaceIfItDoesExist();
  shouldAddSpaceIfItDoesntExist();
  shouldRemoveSpaces();
  shouldRemoveTransitionsGoingOutOfGroupInChildNodesOfGroup();
  removeNodeFromGroup();
  insertNodeAfterInTransitions();
  shouldNotBeAbleToInsertANodeAfterAnotherNodeWhenTheyAreDifferentTypes();
  shouldBeAbleToInsertAStepNodeInsideAGroupNode();
  shouldBeAbleToInsertAGroupNodeInsideAGroupNode();
  shouldNotBeAbleToInsertAStepNodeInsideAStepNode();
  getComponentPosition();
  addCurrentUserToAuthors_CM_shouldAddUserInfo();
  getNodeIds();
  getInactiveNodeIds();
  shouldHandleSaveProjectResponse();
  shouldNotSaveProjectWhenTheUserDoesNotHavePermissionToEditTheProject();
  shouldSaveProject();
  getStepNodesDetailsInOrder();
  getOldToNewIds();
  replaceOldIds();
  replaceIds();
  removeNodeIdFromTransitions();
});

function createNormalSpy() {
  spyOn(configService, 'getConfigParam').and.callFake((param) => {
    if (param === 'projectBaseURL') {
      return projectBaseURL;
    } else if (param === 'projectURL') {
      return projectURL;
    } else if (param === 'saveProjectURL') {
      return saveProjectURL;
    } else if (param === 'wiseBaseURL') {
      return wiseBaseURL;
    }
  });
}

function createConfigServiceGetConfigParamSpy() {
  spyOn(configService, 'getConfigParam').and.callFake((param) => {
    if (param === 'projectBaseURL') {
      return projectBaseURL;
    } else if (param === 'projectURL') {
      return projectURL;
    } else if (param === 'registerNewProjectURL') {
      return registerNewProjectURL;
    } else if (param === 'saveProjectURL') {
      return saveProjectURL;
    } else if (param === 'wiseBaseURL') {
      return wiseBaseURL;
    }
  });
}

function registerNewProject() {
  describe('registerNewProject', () => {
    it('should register new project', () => {
      createConfigServiceGetConfigParamSpy();
      const newProjectIdExpected = projectIdDefault;
      const newProjectIdActual = service.registerNewProject(
        scootersProjectName,
        scootersProjectJSONString
      );
      http.expectOne(registerNewProjectURL).flush(newProjectIdExpected);
      newProjectIdActual.then((result) => {
        expect(result).toEqual(newProjectIdExpected);
      });
    });
  });
}

function isNodeIdUsed() {
  describe('isNodeIdUsed', () => {
    beforeEach(() => {
      service.setProject(demoProjectJSON);
    });
    it('should find used node id in active nodes', () => {
      expect(service.isNodeIdUsed('node1')).toEqual(true);
    });

    it('should find used node id in inactive nodes', () => {
      expect(service.isNodeIdUsed('node789')).toEqual(true);
    });

    it('should not find used node id in active or inactive nodes', () => {
      expect(service.isNodeIdUsed('nodedoesnotexist')).toEqual(false);
    });
  });
}

function isNodeIdToInsertTargetNotSpecified() {
  describe('isNodeIdToInsertTargetNotSpecified', () => {
    it('should return true for null, inactive nodes, steps, and activities', () => {
      expect(service.isNodeIdToInsertTargetNotSpecified('inactiveNodes')).toBeTruthy();
      expect(service.isNodeIdToInsertTargetNotSpecified('inactiveSteps')).toBeTruthy();
      expect(service.isNodeIdToInsertTargetNotSpecified('inactiveGroups')).toBeTruthy();
      expect(service.isNodeIdToInsertTargetNotSpecified(null)).toBeTruthy();
    });

    it('should return false for active nodes and groups', () => {
      expect(service.isNodeIdToInsertTargetNotSpecified('activeNodes')).toBeFalsy();
      expect(service.isNodeIdToInsertTargetNotSpecified('activeGroups')).toBeFalsy();
    });
  });
}

function testGetNodeIdAfter() {
  describe('getNodeIdAfter', () => {
    it('should return the next node in the sequence', () => {
      service.setProject(demoProjectJSON);
      expect(service.getNodeIdAfter('node12')).toEqual('node13');
      expect(service.getNodeIdAfter('node19')).toEqual('group2');
    });
    it('should return null if the node is last', () => {
      service.setProject(demoProjectJSON);
      expect(service.getNodeIdAfter('node39')).toBeNull();
    });
  });
}

function testCreateNodeAfter() {
  describe('createNodeAfter', () => {
    it('should put a new step node after a step node', () => {
      const newNode: any = {
        id: 'node1000',
        type: 'node'
      };
      service.setProject(demoProjectJSON);
      service.createNodeAfter(newNode, 'node19');
      service.parseProject();
      expect(service.idToNode[newNode.id]).toEqual(newNode);
      expect(newNode.transitionLogic.transitions[0].to).toEqual('node20');
      expect(service.getNodeIdAfter('node19')).toEqual('node1000');
    });
  });
}

function shouldGetTheBranchLetter() {
  it('should get the branch letter', () => {
    service.setProject(teacherProjectJSON);
    let branchLetter = service.getBranchLetter('node1');
    expect(branchLetter).toEqual(null);
    branchLetter = service.getBranchLetter('node2');
    expect(branchLetter).toEqual('A');
    branchLetter = service.getBranchLetter('node3');
    expect(branchLetter).toEqual('A');
    branchLetter = service.getBranchLetter('node4');
    expect(branchLetter).toEqual('B');
    branchLetter = service.getBranchLetter('node5');
    expect(branchLetter).toEqual('B');
    branchLetter = service.getBranchLetter('node6');
    expect(branchLetter).toEqual(null);
  });
}

function lockNode() {
  describe('lockNode()', () => {
    it('should add teacherRemoval constraint to node', () => {
      service.setProject(teacherProjectJSON);
      const group1 = service.getNodeById('group1');
      const periodIdToLock = 123;
      expect(group1.constraints).toBeUndefined();
      service.addTeacherRemovalConstraint(group1, periodIdToLock);
      expect(group1.constraints.length).toEqual(1);
      const contraintRemovalCriteria = group1.constraints[0].removalCriteria[0];
      expect(contraintRemovalCriteria.name).toEqual('teacherRemoval');
      expect(contraintRemovalCriteria.params.periodId).toEqual(periodIdToLock);
    });
  });
}

function unlockNode() {
  describe('unlockNode()', () => {
    it('should remove teacherRemoval constraint from node', () => {
      service.setProject(teacherProjectJSON);
      const node6 = service.getNodeById('node6');
      expect(node6.constraints.length).toEqual(2);
      service.removeTeacherRemovalConstraint(node6, 123);
      expect(node6.constraints.length).toEqual(1);
      service.removeTeacherRemovalConstraint(node6, 124);
      expect(node6.constraints.length).toEqual(0);
      service.removeTeacherRemovalConstraint(node6, 999);
      expect(node6.constraints.length).toEqual(0);
    });
  });
}

function getNextAvailableNodeId() {
  describe('getNextAvailableNodeId', () => {
    it('should return the next available node id', () => {
      createNormalSpy();
      service.setProject(scootersProjectJSON);
      expect(service.getNextAvailableNodeId()).toEqual('node43');
      expect(service.getNextAvailableNodeId(['node43'])).toEqual('node44');
      expect(service.getNextAvailableNodeId(['node43', 'node44'])).toEqual('node45');
    });
  });
}

function shouldReturnTheNextAvailableGroupId() {
  it('should return the next available group id', () => {
    createNormalSpy();
    service.setProject(scootersProjectJSON);
    const nextGroupIdExpected = 'group7';
    const nextGroupIdActual = service.getNextAvailableGroupId();
    expect(nextGroupIdActual).toEqual(nextGroupIdExpected);
  });
}

function shouldReturnTheGroupIdsInTheProject() {
  it('should return the group ids in the project', () => {
    createNormalSpy();
    service.setProject(scootersProjectJSON);
    const groupIdsExpected = ['group0', 'group1', 'group2', 'group3', 'group4', 'group5', 'group6'];
    const groupIdsActual = service.getGroupIds();
    expect(groupIdsActual).toEqual(groupIdsExpected);
  });
}

function shouldReturnTheMaxScoreOfTheProject() {
  it('should return the max score of the project', () => {
    service.setProject(demoProjectJSON);
    const demoProjectMaxScoreActual = service.getMaxScore();
    expect(demoProjectMaxScoreActual).toEqual(9);
    service.setProject(scootersProjectJSON);
    const scootersProjectMaxScoreExpected = 18;
    const scootersProjectMaxScoreActual = service.getMaxScore();
    expect(scootersProjectMaxScoreActual).toEqual(scootersProjectMaxScoreExpected);
  });
}

function shouldNotAddSpaceIfItDoesExist() {
  it('should not add space if it does exist', () => {
    service.setProject(scootersProjectJSON);
    const spaces = service.getSpaces();
    expect(spaces.length).toEqual(2);
    const space = {
      id: 'public',
      name: 'Public',
      isPublic: true,
      isShowInNotebook: true
    };
    service.addSpace(space);
    expect(spaces.length).toEqual(2);
    expect(spaces[0].id).toEqual('public');
    expect(spaces[1].id).toEqual('ideasAboutGlobalClimateChange');
  });
}

function shouldAddSpaceIfItDoesntExist() {
  it("should add space if it doesn't exist", () => {
    service.setProject(scootersProjectJSON);
    const spaces = service.getSpaces();
    expect(spaces.length).toEqual(2);
    const space = {
      id: 'newSpace',
      name: 'New Space to share your thoughts',
      isPublic: true,
      isShowInNotebook: false
    };
    service.addSpace(space);
    expect(spaces.length).toEqual(3);
    expect(spaces[0].id).toEqual('public');
    expect(spaces[1].id).toEqual('ideasAboutGlobalClimateChange');
    expect(spaces[2].id).toEqual('newSpace');
  });
}

function shouldRemoveSpaces() {
  let spaces;
  describe('removeSpace', () => {
    beforeEach(() => {
      service.setProject(demoProjectJSON);
      spaces = service.getSpaces();
      expect(spaces.length).toEqual(1);
    });
    it('should not remove a space that does not exist', () => {
      service.removeSpace('public');
      expect(spaces.length).toEqual(1);
    });
    it('should remove a space that does exist', () => {
      service.removeSpace('sharePictures');
      expect(spaces.length).toEqual(0);
    });
  });
}

function shouldRemoveTransitionsGoingOutOfGroupInChildNodesOfGroup() {
  it('should remove transitions going out of group in child nodes of group', () => {
    service.setProject(demoProjectJSON);
    expect(service.getTransitionsByFromNodeId('node18').length).toEqual(1);
    expect(service.getTransitionsByFromNodeId('node19').length).toEqual(1);
    service.removeTransitionsOutOfGroup('group1');
    expect(service.getTransitionsByFromNodeId('node18').length).toEqual(1);
    expect(service.getTransitionsByFromNodeId('node19').length).toEqual(0);
  });
}

function expectChildNodeIdLength(nodeId, expectedLength) {
  expect(service.getChildNodeIdsById(nodeId).length).toEqual(expectedLength);
}

function expectGroupStartId(groupId, expectedStartNodeId) {
  expect(service.getGroupStartId(groupId)).toEqual(expectedStartNodeId);
}

function removeNodeFromGroup() {
  it('should remove node from group', () => {
    service.setProject(demoProjectJSON);
    expectChildNodeIdLength('group1', 19);
    const group1 = service.getNodeById('group1');
    service.removeNodeIdFromGroup(group1, 'node3');
    expectChildNodeIdLength('group1', 18);
    service.removeNodeIdFromGroup(group1, 'node4');
    expectChildNodeIdLength('group1', 17);
    expectGroupStartId('group1', 'node1');
    service.removeNodeIdFromGroup(group1, 'node1');
    expectChildNodeIdLength('group1', 16);
    expectGroupStartId('group1', 'node2');
    service.removeNodeIdFromGroup(group1, 'node2');
    expectChildNodeIdLength('group1', 15);
    expectGroupStartId('group1', 'node3');
  });
}

function expectInsertNodeAfterInTransition(nodeIdBefore, nodeIdAfter) {
  service.setProject(demoProjectJSON);
  expect(
    service.nodeHasTransitionToNodeId(service.getNodeById(nodeIdBefore), nodeIdAfter)
  ).toBeTruthy();
  service.insertNodeAfterInTransitions(service.getNodeById(nodeIdBefore), nodeIdAfter);
  expect(
    service.nodeHasTransitionToNodeId(service.getNodeById(nodeIdBefore), nodeIdAfter)
  ).toBeFalsy();
  expect(
    service.nodeHasTransitionToNodeId(service.getNodeById(nodeIdAfter), nodeIdBefore)
  ).toBeTruthy();
}

function shouldNotBeAbleToInsertANodeAfterAnotherNodeWhenTheyAreDifferentTypes() {
  it('should not be able to insert a node after another node when they are different types', () => {
    service.setProject(demoProjectJSON);
    expect(() => {
      service.insertNodeAfterInTransitions(service.getNodeById('node1'), 'group2');
    }).toThrow('Error: insertNodeAfterInTransitions() nodes are not the same type');
  });
}

function shouldBeAbleToInsertAStepNodeInsideAGroupNode() {
  it('should be able to insert a step node inside an group node', () => {
    service.setProject(demoProjectJSON);
    const node1 = service.getNodeById('node1');
    const node19 = service.getNodeById('node19');
    expect(service.nodeHasTransitionToNodeId(node1, 'node2')).toBeTruthy();
    expect(service.nodeHasTransitionToNodeId(node1, 'node20')).toBeFalsy();
    expect(service.nodeHasTransitionToNodeId(node19, 'node20')).toBeTruthy();
    expect(service.nodeHasTransitionToNodeId(node19, 'node1')).toBeFalsy();
    service.insertNodeInsideOnlyUpdateTransitions('node1', 'group2');
    expect(service.nodeHasTransitionToNodeId(node1, 'node20')).toBeTruthy();
    expect(service.nodeHasTransitionToNodeId(node1, 'node2')).toBeFalsy();
    expect(service.nodeHasTransitionToNodeId(node19, 'node1')).toBeTruthy();
    expect(service.nodeHasTransitionToNodeId(node19, 'node20')).toBeFalsy();
  });
}

function shouldBeAbleToInsertAGroupNodeInsideAGroupNode() {
  it('should be able to insert a group node inside a group node', () => {
    service.setProject(demoProjectJSON);
    const group1 = service.getNodeById('group1');
    const group2 = service.getNodeById('group2');
    expect(service.nodeHasTransitionToNodeId(group1, 'group2')).toBeTruthy();
    expect(service.nodeHasTransitionToNodeId(group2, 'group1')).toBeFalsy();
    service.insertNodeInsideOnlyUpdateTransitions('group2', 'group0');
    expect(service.nodeHasTransitionToNodeId(group2, 'group1')).toBeTruthy();
    /*
     * the transition from group1 to group2 still remains because it is usually
     * removed by calling removeNodeIdFromTransitions() but we don't call it here
     */
    expect(service.nodeHasTransitionToNodeId(group1, 'group2')).toBeTruthy();
  });
}

function shouldNotBeAbleToInsertAStepNodeInsideAStepNode() {
  it('should not be able to insert a step node inside a step node', () => {
    service.setProject(demoProjectJSON);
    expect(() => {
      service.insertNodeInsideOnlyUpdateTransitions('node1', 'node2');
    }).toThrow('Error: insertNodeInsideOnlyUpdateTransitions() second parameter must be a group');
  });
}

function insertNodeAfterInTransitions() {
  it('should be able to insert a step node after another step node', () => {
    expectInsertNodeAfterInTransition('node1', 'node2');
  });
  it('should be able to insert an activity node after another activity node', () => {
    expectInsertNodeAfterInTransition('group1', 'group2');
  });
}

function getComponentPosition() {
  it('should get the component position by node id and comonent id', () => {
    service.setProject(scootersProjectJSON);
    const nullNodeIdResult = service.getComponentPosition(null, '57lxhwfp5r');
    expect(nullNodeIdResult).toEqual(-1);
    const nullComponentIdResult = service.getComponentPosition('node13', null);
    expect(nullComponentIdResult).toEqual(-1);
    const nodeIdDNEResult = service.getComponentPosition('badNodeId', '57lxhwfp5r');
    expect(nodeIdDNEResult).toEqual(-1);
    const componentIdDNEResult = service.getComponentPosition('node13', 'badComponentId');
    expect(componentIdDNEResult).toEqual(-1);
    const componentExists = service.getComponentPosition('node13', '57lxhwfp5r');
    expect(componentExists).toEqual(0);
    const componentExists2 = service.getComponentPosition('node9', 'mnzx68ix8h');
    expect(componentExists2).toEqual(1);
  });
}

function addCurrentUserToAuthors_CM_shouldAddUserInfo() {
  it('should add current user to authors in CM mode', () => {
    spyOn(configService, 'getMyUserInfo').and.returnValue({
      userIds: [1],
      firstName: 'wise',
      lastName: 'panda',
      username: 'wisepanda'
    });
    spyOn(configService, 'isClassroomMonitor').and.returnValue(true);
    const authors = service.addCurrentUserToAuthors([]);
    expect(authors.length).toEqual(1);
    expect(authors[0].id).toEqual(1);
  });
}

function getNodeIds() {
  describe('getNodeIds', () => {
    it('should return the node ids in the project', () => {
      service.setProject(scootersProjectJSON);
      const nodeIdsExpected = [
        'node1',
        'node2',
        'node3',
        'node4',
        'node5',
        'node6',
        'node7',
        'node9',
        'node12',
        'node13',
        'node14',
        'node18',
        'node19',
        'node21',
        'node22',
        'node23',
        'node24',
        'node25',
        'node26',
        'node27',
        'node28',
        'node29',
        'node30',
        'node31',
        'node40',
        'node32',
        'node33',
        'node34',
        'node35',
        'node36',
        'node37',
        'node38',
        'node39',
        'nodeWithNoComponents'
      ];
      const nodeIdsActual = service.getNodeIds();
      expect(nodeIdsActual).toEqual(nodeIdsExpected);
    });
  });
}

function getInactiveNodeIds() {
  describe('getInactiveNodeIds', () => {
    it('should return the inactive nodes in the project', () => {
      service.setProject(scootersProjectJSON);
      expect(service.getInactiveNodeIds()).toEqual(['node41', 'node42']);
    });
  });
}

function shouldHandleSaveProjectResponse() {
  it('should broadcast project saved', () => {
    shouldHandleSaveProjectResponseSuccessHelper('broadcastProjectSaved');
  });
  it('should broadcast not allowed to edit this project', () => {
    shouldHandleSaveProjectResponseErrorHelper(
      'notAllowedToEditThisProject',
      'broadcastNotAllowedToEditThisProject'
    );
  });
  it('should broadcast error saving project', () => {
    shouldHandleSaveProjectResponseErrorHelper('errorSavingProject', 'broadcastErrorSavingProject');
  });
}

function shouldHandleSaveProjectResponseSuccessHelper(functionName: any) {
  shouldHandleSaveProjectResponseHelper('success', '', functionName);
}

function shouldHandleSaveProjectResponseErrorHelper(messageCode: string, functionName: any) {
  shouldHandleSaveProjectResponseHelper('error', messageCode, functionName);
}

function shouldHandleSaveProjectResponseHelper(
  status: string,
  messageCode: string,
  functionName: any
) {
  const response = {
    status: status,
    messageCode: messageCode
  };
  spyOn(service, functionName).and.callFake(() => {});
  service.handleSaveProjectResponse(response);
  expect(service[functionName]).toHaveBeenCalled();
}

function shouldNotSaveProjectWhenTheUserDoesNotHavePermissionToEditTheProject() {
  it('should not save project when the user does not have permission to edit the project', () => {
    service.setProject(scootersProjectJSON);
    spyOn(configService, 'getConfigParam').withArgs('canEditProject').and.returnValue(false);
    expect(service.saveProject()).toEqual(null);
  });
}

function shouldSaveProject() {
  it('should save project', () => {
    spyOn(configService, 'getConfigParam')
      .withArgs('canEditProject')
      .and.returnValue(true)
      .withArgs('saveProjectURL')
      .and.returnValue(saveProjectURL)
      .withArgs('mode')
      .and.returnValue('authoring')
      .withArgs('userInfo')
      .and.returnValue({});
    spyOn(configService, 'getProjectId').and.returnValue(projectIdDefault);
    spyOn(configService, 'getMyUserInfo').and.returnValue({ id: 1 });
    service.setProject(scootersProjectJSON);
    service.saveProject();
    expect(configService.getConfigParam).toHaveBeenCalledWith('saveProjectURL');
    http.expectOne(saveProjectURL);
  });
}

function getStepNodesDetailsInOrder() {
  describe('getStepNodesDetailsInOrder', () => {
    it('should get step nodes details in order', () => {
      service.idToOrder = {
        node1: { order: 2 },
        node3: { order: 1 },
        group1: { order: 0 },
        node2: { order: 3 }
      };
      const nodeIdToPositionAndTitle = {
        node1: '2. Step 2',
        node2: '3. Step 3',
        node3: '1. Step 1'
      };
      spyOn(service, 'isApplicationNode').and.callFake((nodeId: string): boolean => {
        return nodeId.startsWith('node');
      });
      spyOn(service, 'getNodePositionAndTitle').and.callFake((nodeId: string): string => {
        return nodeIdToPositionAndTitle[nodeId];
      });
      const stepNodesDetailsInOrder = service.getStepNodesDetailsInOrder();
      expectStepNodeDetail(stepNodesDetailsInOrder, 0, 'node3', nodeIdToPositionAndTitle['node3']);
      expectStepNodeDetail(stepNodesDetailsInOrder, 1, 'node1', nodeIdToPositionAndTitle['node1']);
      expectStepNodeDetail(stepNodesDetailsInOrder, 2, 'node2', nodeIdToPositionAndTitle['node2']);
    });
  });
}

function expectStepNodeDetail(
  stepNodesDetailsInOrder: any[],
  index: number,
  expectedNodeId: string,
  expectedPositionAndTitle: string
) {
  expect(stepNodesDetailsInOrder[index].nodeId).toEqual(expectedNodeId);
  expect(stepNodesDetailsInOrder[index].nodePositionAndTitle).toEqual(expectedPositionAndTitle);
}

function getOldToNewIds() {
  describe('getOldToNewIds', () => {
    it('should get mappings of old ids to new ids', () => {
      const nodes = [
        createNodeWithComponent('node1', 'component1'),
        createNodeWithComponent('node2', 'component2'),
        createNodeWithComponent('node3', 'component3')
      ];
      service.applicationNodes = nodes;
      service.project = {
        nodes: nodes,
        inactiveNodes: []
      };
      const oldToNewIds = service.getOldToNewIds(nodes);
      expect(oldToNewIds.get('node1')).toEqual('node4');
      expect(oldToNewIds.get('node2')).toEqual('node5');
      expect(oldToNewIds.get('node3')).toEqual('node6');
      expect(oldToNewIds.get('component1')).not.toEqual('component1');
      expect(oldToNewIds.get('component2')).not.toEqual('component2');
      expect(oldToNewIds.get('component3')).not.toEqual('component3');
    });
  });
}

function createNodeWithComponent(nodeId: string, componentId: string): any {
  return {
    id: nodeId,
    components: [{ id: componentId }]
  };
}

function replaceOldIds() {
  describe('replaceOldIds', () => {
    it('should replace old ids', () => {
      const node = {
        connectedComponents: [
          createConnectedComponentObject('node1', 'abc1'),
          createConnectedComponentObject('node2', 'abc2'),
          createConnectedComponentObject('node3', 'abc3'),
          createConnectedComponentObject('node1', 'abc3')
        ]
      };
      const oldToNewIds = new Map();
      oldToNewIds.set('node1', 'node10');
      oldToNewIds.set('node2', 'node11');
      oldToNewIds.set('abc3', 'def3');
      const updatedNode = service.replaceOldIds(node, oldToNewIds);
      const expectedConnectedComponents = [
        createConnectedComponentObject('node10', 'abc1'),
        createConnectedComponentObject('node11', 'abc2'),
        createConnectedComponentObject('node3', 'def3'),
        createConnectedComponentObject('node10', 'def3')
      ];
      for (let c = 0; c < updatedNode.connectedComponents.length; c++) {
        expect(updatedNode.connectedComponents[c].nodeId).toEqual(
          expectedConnectedComponents[c].nodeId
        );
        expect(updatedNode.connectedComponents[c].componentId).toEqual(
          expectedConnectedComponents[c].componentId
        );
      }
    });
  });
}

function createConnectedComponentObject(nodeId: string, componentId: string): any {
  return {
    nodeId: nodeId,
    componentId: componentId
  };
}

function replaceIds() {
  describe('replaceIds', () => {
    it('should replace ids in a string', () => {
      const string = '{ "id": "node1", "constraints": [{ "id": "node1Constraint1" }] }';
      const expectedString = '{ "id": "node10", "constraints": [{ "id": "node10Constraint1" }] }';
      expect(service.replaceIds(string, 'node1', 'node10')).toEqual(expectedString);
    });
    it('should replace all instances of the ids in a string', () => {
      const string = '"node1", "node1", "node2", "node10", "node11", "node11"';
      const expectedString = '"node10", "node10", "node2", "node10", "node11", "node11"';
      expect(service.replaceIds(string, 'node1', 'node10')).toEqual(expectedString);
    });
  });
}

function removeNodeIdFromTransitions() {
  describe('removeNodeIdFromTransitions()', () => {
    beforeEach(() => {
      service.setProject(demoProjectJSON);
    });
    describe('remove the first step in the lesson', () => {
      it('changes the start id of the parent group to the next step', () => {
        deleteNodeService.deleteNode('node790');
        expect(service.getNodeById('group3').startId).toEqual('node791');
      });
    });
    describe('remove all steps in the lesson', () => {
      it('changes the start id of the parent group to empty string', () => {
        deleteNodeService.deleteNode('node790');
        deleteNodeService.deleteNode('node791');
        expect(service.getNodeById('group3').startId).toEqual('');
      });
    });
    describe('remove the first lesson', () => {
      it('changes the start id of the root group to be the second lesson', () => {
        deleteNodeService.deleteNode('group1');
        expect(service.getNodeById('group0').startId).toEqual('group2');
      });
    });
  });
}
