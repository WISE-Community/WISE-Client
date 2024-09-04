import { ComponentContent } from './ComponentContent';
import { Node } from './Node';

const componentId1 = 'c1';
const componentId2 = 'c2';
let node: Node;
const nodeId1 = 'node1';
const nodeId2 = 'node2';
const node1TransitionLogic = {
  transitions: [{ to: 'node2' }, { to: 'node3' }]
};

describe('Node', () => {
  beforeEach(() => {
    node = new Node();
    node.id = 'node1';
    node.components = [
      { id: componentId1, prompt: 'a' },
      { id: componentId2, prompt: 'b' }
    ];
    node.transitionLogic = node1TransitionLogic;
  });
  copyComponents();
  deleteComponent();
  getNodeIcon();
  getNodeIdComponentIds();
  moveComponents();
  replaceComponent();
  getAllRelatedComponents();
  deleteTransition();
  getNumRubrics();
  getComponentPosition();
});

function copyComponents() {
  describe('copyComponents() without specifying insertAfterComponentId', () => {
    it('should copy the components, insert at the beginning and return new components', () => {
      const copies = node.copyComponents([componentId1, componentId2]);
      expect(node.components.length).toEqual(4);
      expect(copies.length).toEqual(2);
      expect(copies[0].id).not.toEqual(componentId1);
      expect(copies[1].id).not.toEqual(componentId2);
    });
  });
}

function deleteComponent() {
  describe('deleteComponent()', () => {
    it('should delete the component from the node and return the component', () => {
      const deletedComponent = node.deleteComponent(componentId1);
      expect(deletedComponent.id).toEqual(componentId1);
      expect(node.components.length).toEqual(1);
      expect(node.components[0].id).toEqual(componentId2);
    });
  });
}

function getNodeIcon() {
  describe('getNodeIcon()', () => {
    getNodeIcon_noIconSpecified_returnDefaultIcon();
    getNodeIcon_iconSpecified_returnMergedIcon();
  });
}

function getNodeIcon_noIconSpecified_returnDefaultIcon() {
  it('should return default icon if icon is not set', () => {
    const icon = node.getIcon();
    expect(icon.color).toEqual('#757575');
    expect(icon.type).toEqual('font');
  });
}

function getNodeIcon_iconSpecified_returnMergedIcon() {
  it('should return merged icon if an icon is set', () => {
    node.icons = {
      default: {
        color: 'rgba(0,1,1,0)',
        fontName: 'check'
      }
    };
    const icon = node.getIcon();
    expect(icon.color).toEqual('rgba(0,1,1,0)');
    expect(icon.fontName).toEqual('check');
  });
}

function getNodeIdComponentIds() {
  it('should get the node id and component id objects', () => {
    node.id = 'node1';
    node.components = [{ id: 'abc' }, { id: 'xyz' }];
    const nodeIdAndComponentIds = node.getNodeIdComponentIds();
    expect(nodeIdAndComponentIds.length).toEqual(2);
    expect(nodeIdAndComponentIds[0].nodeId).toEqual('node1');
    expect(nodeIdAndComponentIds[0].componentId).toEqual('abc');
    expect(nodeIdAndComponentIds[1].nodeId).toEqual('node1');
    expect(nodeIdAndComponentIds[1].componentId).toEqual('xyz');
  });
}

function moveComponents() {
  describe('moveComponents()', () => {
    beforeEach(() => {
      node.components = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }, { id: 'e' }];
    });
    moveComponents_NullInsertAfterComponentId_MoveComponentsToBeginning();
    moveComponents_NonNullInsertAfterComponentId_MoveMultipleComponentsAfterComponent();
  });
}

function moveComponents_NullInsertAfterComponentId_MoveComponentsToBeginning() {
  describe('insertAfterComponentId is null', () => {
    it('should move components to the beginning of the node', () => {
      node.moveComponents(['b', 'c', 'e'], null);
      expect(node.components.map((component) => component.id).join(',')).toEqual('b,c,e,a,d');
    });
  });
}

function moveComponents_NonNullInsertAfterComponentId_MoveMultipleComponentsAfterComponent() {
  describe('insertAfterComponentId is not null', () => {
    it('should move components after the specified component', () => {
      node.moveComponents(['b', 'c', 'e'], 'a');
      expect(node.components.map((component) => component.id).join(',')).toEqual('a,b,c,e,d');
    });
  });
}

function replaceComponent() {
  describe('replaceComponent()', () => {
    it('should replace the specified component', () => {
      node.replaceComponent(componentId2, { id: componentId2, prompt: 'c' } as ComponentContent);
      expect(node.components[1].prompt).toEqual('c');
    });
  });
}

function getAllRelatedComponents() {
  describe('getAllRelatedComponents()', () => {
    getAllRelatedComponents_stepHasRegularComponents_getsRelatedComponents();
    getAllRelatedComponents_stepHasShowMyWorkComponent_getsRelatedComponents();
    getAllRelatedComponents_stepHasDiscussionWithConnectedComponent_getsRelatedComponents();
  });
}

function getAllRelatedComponents_stepHasRegularComponents_getsRelatedComponents() {
  describe('step has regular components', () => {
    it('gets the related components', () => {
      node.components = [
        {
          id: componentId1,
          type: 'OpenResponse'
        },
        {
          id: componentId2,
          type: 'MultipleChoice'
        }
      ];
      expect(node.getAllRelatedComponents()).toEqual([
        { nodeId: nodeId1, componentId: componentId1 },
        { nodeId: nodeId1, componentId: componentId2 }
      ]);
    });
  });
}

function getAllRelatedComponents_stepHasShowMyWorkComponent_getsRelatedComponents() {
  describe('step has a show my work component', () => {
    it('gets the related components', () => {
      node.components = [
        {
          id: componentId1,
          type: 'ShowMyWork',
          showWorkNodeId: nodeId2,
          showWorkComponentId: componentId2
        }
      ];
      expect(node.getAllRelatedComponents()).toEqual([
        { nodeId: nodeId1, componentId: componentId1 },
        { nodeId: nodeId2, componentId: componentId2 }
      ]);
    });
  });
}

function getAllRelatedComponents_stepHasDiscussionWithConnectedComponent_getsRelatedComponents() {
  describe('step has a discussion component with a connected component', () => {
    it('gets the related components', () => {
      node.components = [
        {
          id: componentId1,
          type: 'Discussion',
          connectedComponents: [
            {
              nodeId: nodeId2,
              componentId: componentId2,
              type: 'importWork'
            }
          ]
        }
      ];
      expect(node.getAllRelatedComponents()).toEqual([
        { nodeId: nodeId1, componentId: componentId1 },
        { nodeId: nodeId2, componentId: componentId2, type: 'importWork' }
      ]);
    });
  });
}

function deleteTransition() {
  describe('deleteTransition', () => {
    it('should delete existing transition from the node', () => {
      expect(node.getTransitionLogic().transitions.length).toEqual(2);
      node.deleteTransition(node1TransitionLogic.transitions[0]);
      expect(node.getTransitionLogic().transitions.length).toEqual(1);
      expect(node.getTransitionLogic().transitions[0].to).toEqual('node3');
    });
  });
}

function getNumRubrics() {
  describe('getNumRubrics()', () => {
    it("should return 0 when node and components don't have any rubric", () => {
      expect(node.getNumRubrics()).toEqual(0);
    });
    it('should return total number of rubrics for the node and its components', () => {
      node.rubric = 'node rubric';
      node.components[0].rubric = 'component 1 rubric';
      node.components[1].rubric = 'component 2 rubric';
      expect(node.getNumRubrics()).toEqual(3);
    });
  });
}

function getComponentPosition() {
  describe('getComponentPosition()', () => {
    it('should return index of the specified component id', () => {
      expect(node.getComponentPosition(componentId1)).toEqual(0);
      expect(node.getComponentPosition(componentId2)).toEqual(1);
      expect(node.getComponentPosition('invalid_id')).toEqual(-1);
    });
  });
}
