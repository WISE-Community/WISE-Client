import vleModule from '../../vle/vle';

let NodeService;
let ProjectService;
let StudentDataService;
let demoProjectJSON;
const demoProjectJSONOriginal = window.mocks['test-unit/sampleData/curriculum/DemoProject/project'];

describe('NodeService', () => {
  beforeEach(angular.mock.module(vleModule.name));
  beforeEach(inject(function(
    _NodeService_,
    _ProjectService_,
    _StudentDataService_,
    _$q_
  ) {
    NodeService = _NodeService_;
    ProjectService = _ProjectService_;
    StudentDataService = _StudentDataService_;
    StudentDataService.studentData = { events: [] };
    demoProjectJSON = copy(demoProjectJSONOriginal);
    ProjectService.setProject(demoProjectJSON);
  }));
  getNextNodeId();
  extractComponents();
  insertComponentsAfter();
});

function getNextNodeId() {
  describe('getNextNodeNodeId', () => {
    getNextNodeNodeId_ReturnNextNodeInProject();
  });
}

function getNextNodeNodeId_ReturnNextNodeInProject() {
  it('should return the next node in the project', async () => {
    spyOn(NodeService, 'chooseTransition').and.returnValue(Promise.resolve({ to: 'node2' }));
    NodeService.getNextNodeId('node1').then(nextNodeId => {
      expect(NodeService.chooseTransition).toHaveBeenCalled();
      expect(nextNodeId).toEqual('node2');
    });
  });
}

function extractComponents() {
  describe('extractComponents', () => {
    extractComponents_MultipleComponents();
  });
}

function insertComponentsAfter() {
  describe('insertComponentsAfter', () => {
    insertComponentsAfter_MultipleComponents();
  });
}

function insertComponentsAfter_MultipleComponents() {
  it('should move multiple components after specified component', () => {
    const componentsToInsert = [{id:1},{id:10}];
    const components = [{id:2}];
    const insertAfterComponentId = 2;
    NodeService.insertComponentsAfter(componentsToInsert, components, insertAfterComponentId);
    expect(components.length).toEqual(3);
    expect(components.map(c => c.id)).toEqual([2,1,10]);
  });
}

function extractComponents_MultipleComponents() {
  it('should extract multiple components and change original component array', () => {
    const components = [{id:1},{id:2},{id:10}];
    const componentIdsToExtract = [1, 10];
    const extractedComponents = NodeService.extractComponents(components, componentIdsToExtract);
    expect(extractedComponents.length).toEqual(2);
    expect(extractedComponents[0].id).toEqual(1);
    expect(extractedComponents[1].id).toEqual(10);
    expect(components.length).toEqual(1);
    expect(components[0].id).toEqual(2);
  });
}
