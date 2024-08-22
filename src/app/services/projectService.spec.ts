import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { ConfigService } from '../../assets/wise5/services/configService';
import branchSpansMultipleActivitiesJSON_import from './sampleData/curriculum/BranchSpansActivities.project.json';
import demoProjectJSON_import from './sampleData/curriculum/Demo.project.json';
import oneBranchTwoPathsProjectJSON_import from './sampleData/curriculum/OneBranchTwoPaths.project.json';
import scootersProjectJSON_import from './sampleData/curriculum/SelfPropelledVehiclesChallenge.project.json';
import twoStepsProjectJSON_import from './sampleData/curriculum/TwoSteps.project.json';
import twoLesssonsProjectJSON_import from './sampleData/curriculum/TwoLessons.project.json';
import { PeerGrouping } from '../domain/peerGrouping';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { EmbeddedContent } from '../../assets/wise5/components/embedded/EmbeddedContent';
import { copy } from '../../assets/wise5/common/object/object';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

const projectIdDefault = 1;
const projectBaseURL = 'http://localhost:8080/curriculum/12345/';
const projectURL = projectBaseURL + 'project.json';
const saveProjectURL = 'http://localhost:8080/wise/project/save/' + projectIdDefault;
const wiseBaseURL = '/wise';
let service: ProjectService;
let configService: ConfigService;
let http: HttpTestingController;
let branchSpansActivitiesProjectJSON: any;
let demoProjectJSON: any;
let oneBranchTwoPathsProjectJSON: any;
let scootersProjectJSON: any;
let twoStepsProjectJSON: any;
let twoLessonsProjectJSON: any;
describe('ProjectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StudentTeacherCommonServicesModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    http = TestBed.inject(HttpTestingController);
    configService = TestBed.inject(ConfigService);
    service = TestBed.inject(ProjectService);
    branchSpansActivitiesProjectJSON = copy(branchSpansMultipleActivitiesJSON_import);
    demoProjectJSON = copy(demoProjectJSON_import);
    oneBranchTwoPathsProjectJSON = copy(oneBranchTwoPathsProjectJSON_import);
    scootersProjectJSON = copy(scootersProjectJSON_import);
    twoStepsProjectJSON = copy(twoStepsProjectJSON_import);
    twoLessonsProjectJSON = copy(twoLesssonsProjectJSON_import);
  });
  shouldReplaceAssetPathsInNonHtmlComponentContent();
  shouldReplaceAssetPathsInHtmlComponentContent();
  shouldNotReplaceAssetPathsInHtmlComponentContent();
  shouldRetrieveProjectWhenConfigProjectURLIsValid();
  shouldGetDefaultThemePath();
  shouldReturnTheStartNodeOfTheProject();
  shouldReturnTheNodeByNodeId();
  shouldReturnTheNodeTitleByNodeId();
  shouldGetTheComponent();
  shouldGetTheComponentsByNodeId();
  shouldCheckOrderBetweenStepGroupAndStepGroup();
  shouldIdentifyBranchStartAndMergePoints();
  calculateNodeOrder();
  getGroupNodesIdToOrder();
  getTags();
  getAllPaths();
  getParentGroup();
  getMaxScoreForComponent();
  getMaxScoreForNode();
  getPeerGrouping();
  parseProject();
  // TODO: add test for service.getFlattenedProjectAsNodeIds()
  // TODO: add test for service.getFirstNodeIdInPathAtIndex()
  // TODO: add test for service.removeNodeIdFromPaths()
  // TODO: add test for service.removeNodeIdFromPath()
  // TODO: add test for service.areFirstNodeIdsInPathsTheSame()
  // TODO: add test for service.getBranches()
  // TODO: add test for service.findBranches()
  // TODO: add test for service.findNextCommonNodeId()
  // TODO: add test for service.allPathsContainNodeId()
  // TODO: add test for service.trimPathsUpToNodeId()
  // TODO: add test for service.extractPathsUpToNodeId()
  // TODO: add test for service.removeDuplicatePaths()
  // TODO: add test for service.pathsEqual()
  // TODO: add test for service.getNodeContentByNodeId()
  // TODO: add test for service.createGroup()
  // TODO: add test for service.createNode()
  // TODO: add test for service.createNodeInside()
  // TODO: add test for service.createNodeAfter()
  // TODO: add test for service.insertNodeAfterInGroups()
  // TODO: add test for service.insertNodeInsideInGroups()
  // TODO: add test for service.insertNodeInsideOnlyUpdateTransitions()
  // MARK: Tests for Node and Group Id functions
  // TODO: add test for service.getNodePositionAndTitle()
  // TODO: add test for service.deconsteNode()
  // TODO: add test for service.removeNodeIdFromGroups()
  // TODO: add test for service.createComponent()
  // TODO: add test for service.addComponentToNode()
  // TODO: add test for service.moveComponentUp()
  // TODO: add test for service.moveComponentDown()
  // TODO: add test for service.deconsteComponent()
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

function shouldReplaceAssetPathsInNonHtmlComponentContent() {
  it('should replace asset paths in non-html component content', () => {
    createNormalSpy();
    const contentString = "<img src='hello.png' /><style>{background-url:'background.jpg'}</style>";
    const contentStringReplacedAssetPathExpected =
      "<img src='" +
      projectBaseURL +
      "assets/hello.png' /><style>{background-url:'" +
      projectBaseURL +
      "assets/background.jpg'}</style>";
    const contentStringReplacedAssetPathActual = service.replaceAssetPaths(contentString);
    expect(configService.getConfigParam).toHaveBeenCalledWith('projectBaseURL');
    expect(contentStringReplacedAssetPathActual).toEqual(contentStringReplacedAssetPathExpected);
  });
}

function shouldReplaceAssetPathsInHtmlComponentContent() {
  it('should replace asset paths in html component content', () => {
    createNormalSpy();
    const contentString = 'style=\\"background-image: url(\\"background.jpg\\")\\"';
    const contentStringReplacedAssetPathExpected =
      'style=\\"background-image: url(\\"' + projectBaseURL + 'assets/background.jpg\\")\\"';
    const contentStringReplacedAssetPathActual = service.replaceAssetPaths(contentString);
    expect(configService.getConfigParam).toHaveBeenCalledWith('projectBaseURL');
    expect(contentStringReplacedAssetPathActual).toEqual(contentStringReplacedAssetPathExpected);
  });
}

function shouldNotReplaceAssetPathsInHtmlComponentContent() {
  it('should not replace asset paths in html component content', () => {
    createNormalSpy();
    const contentString = '<source type="video/mp4">';
    const contentStringReplacedAssetPathExpected = '<source type="video/mp4">';
    const contentStringReplacedAssetPathActual = service.replaceAssetPaths(contentString);
    expect(configService.getConfigParam).toHaveBeenCalledWith('projectBaseURL');
    expect(contentStringReplacedAssetPathActual).toEqual(contentStringReplacedAssetPathExpected);
  });
}

function shouldRetrieveProjectWhenConfigProjectURLIsValid() {
  it('should retrieve project when Config.projectURL is valid', () => {
    spyOn(configService, 'getConfigParam').withArgs('projectURL').and.returnValue(projectURL);
    service.retrieveProject().subscribe((response) => {
      expect(response).toEqual(scootersProjectJSON);
    });
    http.expectOne(projectURL);
  });
}

function shouldGetDefaultThemePath() {
  it('should get default theme path', () => {
    spyOn(configService, 'getConfigParam').and.returnValue(wiseBaseURL);
    service.setProject(scootersProjectJSON);
    const expectedThemePath = wiseBaseURL + '/assets/wise5/themes/default';
    const actualThemePath = service.getThemePath();
    expect(configService.getConfigParam).toHaveBeenCalledWith('wiseBaseURL');
    expect(actualThemePath).toEqual(expectedThemePath);
  });
}

function shouldReturnTheStartNodeOfTheProject() {
  it('should return the start node of the project', () => {
    service.setProject(demoProjectJSON);
    const expectedStartNodeId = 'node1'; // Demo project's start node id
    const actualStartNodeId = service.getStartNodeId();
    expect(actualStartNodeId).toEqual(expectedStartNodeId);
  });
}

function shouldReturnTheNodeByNodeId() {
  it('should return the node by nodeId', () => {
    service.setProject(scootersProjectJSON);
    const node1 = service.getNodeById('node1');
    expect(node1.type).toEqual('node');
    expect(node1.title).toEqual('Introduction to Newton Scooters');
    expect(node1.components.length).toEqual(1);

    // Test node that doesn't exist in project and make sure the function returns null
    const nodeNE = service.getNodeById('node999');
    expect(nodeNE).toBeNull();
  });
}

function shouldReturnTheNodeTitleByNodeId() {
  it('should return the node title by nodeId', () => {
    service.setProject(scootersProjectJSON);
    const node1Title = service.getNodeTitle('node1');
    expect(node1Title).toEqual('Introduction to Newton Scooters');

    // Test node that doesn't exist in project and make sure the function returns null
    const nodeTitleNE = service.getNodeTitle('node999');
    expect(nodeTitleNE).toBeNull();
  });
}

function shouldGetTheComponent() {
  it('should get the component by node id and component id', () => {
    service.setProject(scootersProjectJSON);
    const nullNodeIdResult = service.getComponent(null, '57lxhwfp5r');
    expect(nullNodeIdResult).toBeNull();

    const nullComponentIdResult = service.getComponent('node13', null);
    expect(nullComponentIdResult).toBeNull();

    const nodeIdDNEResult = service.getComponent('badNodeId', '57lxhwfp5r');
    expect(nodeIdDNEResult).toBeNull();

    const componentIdDNEResult = service.getComponent('node13', 'badComponentId');
    expect(componentIdDNEResult).toBeNull();

    const componentExists = service.getComponent('node13', '57lxhwfp5r');
    expect(componentExists).not.toBe(null);
    expect(componentExists.type).toEqual('HTML');

    const componentExists2 = service.getComponent('node9', 'mnzx68ix8h') as EmbeddedContent;
    expect(componentExists2).not.toBe(null);
    expect(componentExists2.type).toEqual('embedded');
    expect(componentExists2.url).toEqual('NewtonScooters-potential-kinetic.html');
  });
}

function shouldGetTheComponentsByNodeId() {
  it('should get the components by node id', () => {
    service.setProject(scootersProjectJSON);
    const nullNodeIdResult = service.getComponents(null);
    expect(nullNodeIdResult).toEqual([]);
    const nodeIdDNEResult = service.getComponents('badNodeId');
    expect(nodeIdDNEResult).toEqual([]);
    const nodeWithNullComponentResult = service.getComponents('nodeWithNoComponents');
    expect(nodeWithNullComponentResult).toEqual([]);
    const nodeExistsResult = service.getComponents('node13');
    expect(nodeExistsResult).not.toBe(null);
    expect(nodeExistsResult.length).toEqual(1);
    expect(nodeExistsResult[0].id).toEqual('57lxhwfp5r');

    const nodeExistsResult2 = service.getComponents('node9');
    expect(nodeExistsResult2).not.toBe(null);
    expect(nodeExistsResult2.length).toEqual(7);
    expect(nodeExistsResult2[2].id).toEqual('nm080ntk8e');
    expect(nodeExistsResult2[2].type).toEqual('Table');
  });
}

function shouldCheckOrderBetweenStepGroupAndStepGroup() {
  it('should check order between step/group and step/group', () => {
    service.setProject(demoProjectJSON);
    expect(service.isNodeIdAfter('node1', 'node2')).toBeTruthy();
    expect(service.isNodeIdAfter('node2', 'node1')).toBeFalsy();
    expect(service.isNodeIdAfter('node1', 'group2')).toBeTruthy();
    expect(service.isNodeIdAfter('node20', 'group1')).toBeFalsy();
    expect(service.isNodeIdAfter('group1', 'group2')).toBeTruthy();
    expect(service.isNodeIdAfter('group2', 'group1')).toBeFalsy();
    expect(service.isNodeIdAfter('group1', 'node20')).toBeTruthy();
    expect(service.isNodeIdAfter('group2', 'node1')).toBeFalsy();
  });
}

function shouldIdentifyBranchStartAndMergePoints() {
  it('should identify branch start point', () => {
    service.setProject(demoProjectJSON);
    expectFunctionCallToReturnValue('isBranchStartPoint', ['group1', 'node29', 'node32'], false);
    expectFunctionCallToReturnValue('isBranchStartPoint', ['node30'], true);
    expectFunctionCallToReturnValue('isBranchMergePoint', ['group1', 'node30', 'node32'], false);
    expectFunctionCallToReturnValue('isBranchMergePoint', ['node34'], true);
  });
}

function expectFunctionCallToReturnValue(func, nodeIdArray, expectedValue) {
  nodeIdArray.forEach((nodeId) => {
    expect(service[func](nodeId)).toEqual(expectedValue);
  });
}

function calculateNodeOrder() {
  describe('calculateNodeOrder', () => {
    it('should calculate the node order', () => {
      service.project = demoProjectJSON;
      service.loadNodes(demoProjectJSON.nodes);
      service.calculateNodeOrder(demoProjectJSON.nodes[0]);
      expect(service.idToOrder['group0'].order).toEqual(0);
      expect(service.idToOrder['group1'].order).toEqual(1);
      expect(service.idToOrder['node1'].order).toEqual(2);
      expect(service.idToOrder['node2'].order).toEqual(3);
      expect(service.idToOrder['node3'].order).toEqual(4);
      expect(service.idToOrder['node4'].order).toEqual(5);
      expect(service.idToOrder['node5'].order).toEqual(6);
      expect(service.idToOrder['node6'].order).toEqual(7);
    });
  });
}

function getGroupNodesIdToOrder() {
  describe('getGroupNodesIdToOrder', () => {
    it('should return only group nodes in idToOrder', () => {
      service.project = demoProjectJSON;
      service.loadNodes(demoProjectJSON.nodes);
      service.calculateNodeOrder(demoProjectJSON.nodes[0]);
      expect(service.getGroupNodesIdToOrder()).toEqual({
        group0: { order: 0 },
        group1: { order: 1 },
        group2: { order: 21 },
        group3: { order: 37 },
        group4: { order: 40 },
        group5: { order: 48 }
      });
    });
  });
}

function getTags() {
  it('should get tags from the project', () => {
    service.setProject(demoProjectJSON);
    const tags = service.getTags();
    expect(tags.length).toEqual(2);
    expect(tags[0].name).toEqual('Group 1');
    expect(tags[1].name).toEqual('Group 2');
  });
}

function getAllPaths() {
  describe('getAllPaths()', () => {
    it('should get all paths in a unit with no branches', () => {
      service.setProject(twoStepsProjectJSON);
      const allPaths = service.getAllPaths([], service.getStartNodeId(), true);
      expect(allPaths.length).toEqual(1);
      expect(allPaths[0]).toEqual(['group1', 'node1', 'node2']);
    });
    it('should get all paths in a unit with a branch with two paths', () => {
      service.setProject(oneBranchTwoPathsProjectJSON);
      const allPaths = service.getAllPaths([], service.getStartNodeId(), true);
      expect(allPaths.length).toEqual(2);
      expect(allPaths[0]).toEqual(['group1', 'node1', 'node2', 'node3', 'node4', 'node8']);
      expect(allPaths[1]).toEqual(['group1', 'node1', 'node2', 'node5', 'node6', 'node7', 'node8']);
    });
    it('should get all paths in a unit starting with a node in a branch path', () => {
      service.setProject(oneBranchTwoPathsProjectJSON);
      const allPaths1 = service.getAllPaths(['group1', 'node1', 'node2'], 'node3', true);
      expect(allPaths1.length).toEqual(1);
      expect(allPaths1[0]).toEqual(['node3', 'node4', 'node8']);
      const allPaths2 = service.getAllPaths(['group1', 'node1', 'node2'], 'node5', true);
      expect(allPaths2.length).toEqual(1);
      expect(allPaths2[0]).toEqual(['node5', 'node6', 'node7', 'node8']);
    });
  });
}

function getParentGroup() {
  describe('getParentGroup()', () => {
    beforeEach(() => {
      service.setProject(twoStepsProjectJSON);
    });
    it('should get the parent group of an active node', () => {
      expect(service.getParentGroup('node1').id).toEqual('group1');
    });
    it('should get the parent group of an inactive node', () => {
      expect(service.getParentGroup('node3').id).toEqual('group2');
    });
  });
}

function getMaxScoreForNode() {
  describe('getMaxScoreForNode()', () => {
    getMaxScoreForNode_noExcludedComponents_returnSumOfComponentMaxScores();
    getMaxScoreForNode_excludeComponentFromTotalScore_returnExcludedScore();
  });
}

function getMaxScoreForNode_noExcludedComponents_returnSumOfComponentMaxScores() {
  it('should return sum of all component max scores', () => {
    service.setProject(demoProjectJSON);
    expect(service.getMaxScoreForNode('node10')).toEqual(9);
  });
}

function getMaxScoreForNode_excludeComponentFromTotalScore_returnExcludedScore() {
  it('should return sum of component max scores that are not excluded', () => {
    service.setProject(demoProjectJSON);
    service.getComponent('node10', '2upmb3om1q').excludeFromTotalScore = true;
    expect(service.getMaxScoreForNode('node10')).toEqual(6);
  });
}

function getMaxScoreForComponent() {
  describe('getMaxScoreForComponent()', () => {
    getMaxScoreForComponent_excludeFromTotalScore_returnNull();
  });
}

function getMaxScoreForComponent_excludeFromTotalScore_returnNull() {
  it('should return null if component is excluded from total score', () => {
    service.setProject(demoProjectJSON);
    service.getComponent('node2', '7edwu1p29b').excludeFromTotalScore = true;
    expect(service.getMaxScoreForComponent('node2', '7edwu1p29b')).toBeNull();
  });
}

function getPeerGrouping() {
  describe('getPeerGrouping', () => {
    it('should get peer grouping', () => {
      const tag1 = 'tag1';
      const tag2 = 'tag2';
      const peerGrouping1 = new PeerGrouping({ name: 'Group 1', tag: tag1 });
      const peerGrouping2 = new PeerGrouping({ name: 'Group 2', tag: tag2 });
      service.project = {
        peerGroupings: [peerGrouping1, peerGrouping2]
      };
      expect(service.getPeerGrouping(tag1)).toEqual(peerGrouping1);
      expect(service.getPeerGrouping(tag2)).toEqual(peerGrouping2);
    });
  });
}

function parseProject(): void {
  describe('parseProject()', () => {
    it('should filter dangling group nodes', () => {
      service.project = twoStepsProjectJSON;
      service.parseProject();
      expect(service.getGroupNodes().map((node) => node.id)).toEqual(['group0', 'group1']);
    });
    calculateNodeNumbers();
  });
}

function calculateNodeNumbers(): void {
  calculateNodeNumbersWhenNoBranches();
  calculateNodeNumbersWhenBranchInOneActivity();
  calculateNodeNumbersWhenBranchSpansMultipleActivities();
  calculateNodeNumbersWhenOnlyLessons();
  calculateNodeNumbersWhenNoLessons();
}

function calculateNodeNumbersWhenNoBranches(): void {
  describe('project with no branches', () => {
    it('should calculate node numbers correctly', () => {
      service.project = twoStepsProjectJSON;
      service.parseProject();
      expectNodeIdsToHaveNumbers([
        { nodeId: 'group1', number: '1' },
        { nodeId: 'node1', number: '1.1' },
        { nodeId: 'node2', number: '1.2' }
      ]);
    });
  });
}

function calculateNodeNumbersWhenBranchInOneActivity(): void {
  describe('project with a branch in an activity', () => {
    it('should calculate node numbers and branch letters correctly', () => {
      service.project = oneBranchTwoPathsProjectJSON;
      service.parseProject();
      expectNodeIdsToHaveNumbers([
        { nodeId: 'group1', number: '1' },
        { nodeId: 'node1', number: '1.1' },
        { nodeId: 'node2', number: '1.2' },
        { nodeId: 'node3', number: '1.3 A' },
        { nodeId: 'node4', number: '1.4 A' },
        { nodeId: 'node5', number: '1.3 B' },
        { nodeId: 'node6', number: '1.4 B' },
        { nodeId: 'node7', number: '1.5 B' },
        { nodeId: 'node8', number: '1.6' }
      ]);
    });
  });
}

function calculateNodeNumbersWhenBranchSpansMultipleActivities(): void {
  describe('project with a branch that spans multiple activities', () => {
    it('should calculate node numbers and branch letters correctly', () => {
      service.project = branchSpansActivitiesProjectJSON;
      service.parseProject();
      expectNodeIdsToHaveNumbers([
        { nodeId: 'group1', number: '1' },
        { nodeId: 'node1', number: '1.1' },
        { nodeId: 'node2', number: '1.2 A' },
        { nodeId: 'node3', number: '1.2 B' },
        { nodeId: 'group2', number: '2' },
        { nodeId: 'node4', number: '2.1 A' },
        { nodeId: 'node5', number: '2.1 B' },
        { nodeId: 'node6', number: '2.2 B' },
        { nodeId: 'node7', number: '2.3' }
      ]);
    });
  });
}

function calculateNodeNumbersWhenOnlyLessons(): void {
  describe('project with only lessons', () => {
    it('should calculate node numbers correctly', () => {
      service.project = twoLessonsProjectJSON;
      service.parseProject();
      expectNodeIdsToHaveNumbers([
        { nodeId: 'group1', number: '1' },
        { nodeId: 'group2', number: '2' }
      ]);
    });
  });
}

function calculateNodeNumbersWhenNoLessons(): void {
  describe('project with no lessons', () => {
    it('calculates node numbers correctly', () => {
      service.project = {
        nodes: [{ id: 'group0', type: 'group', ids: [], startId: '' }],
        startNodeId: 'group0',
        startGroupId: 'group0',
        metadata: {}
      };
      service.parseProject();
      expectNodeIdsToHaveNumbers([{ nodeId: 'group0', number: '0' }]);
    });
  });
}

function expectNodeIdsToHaveNumbers(objs: any[]): void {
  objs.forEach((obj: any) => {
    expectNodeIdToHaveNumber(obj.nodeId, obj.number);
  });
}

function expectNodeIdToHaveNumber(nodeId: string, number: string): void {
  expect(service.nodeIdToNumber[nodeId]).toEqual(number);
}
