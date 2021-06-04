import { Node } from './Node';

describe('Node', () => {
  getNodeIcon();
  getNodeIdComponentIds();
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
    const node = new Node();
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
