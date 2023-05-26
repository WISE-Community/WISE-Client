import { Node } from './Node';

let node = new Node();
describe('Node', () => {
  getNodeIcon();
  getNodeIdComponentIds();
  moveComponents();
});

function getNodeIcon() {
  describe('getNodeIcon()', () => {
    getNodeIcon_noIconSpecified_returnDefaultIcon();
    getNodeIcon_iconSpecified_returnMergedIcon();
  });
}

function getNodeIcon_noIconSpecified_returnDefaultIcon() {
  it('should return default icon if icon is not set', () => {
    const icon = new Node().getIcon();
    expect(icon.color).toEqual('#757575');
    expect(icon.type).toEqual('font');
  });
}

function getNodeIcon_iconSpecified_returnMergedIcon() {
  it('should return merged icon if an icon is set', () => {
    const node = new Node();
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
