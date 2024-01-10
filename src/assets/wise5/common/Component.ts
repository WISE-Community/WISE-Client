import { ComponentContent } from './ComponentContent';

export class Component {
  content: ComponentContent;
  id: string;
  nodeId: string;

  constructor(content: ComponentContent, nodeId: string) {
    this.content = content;
    this.id = content.id;
    this.nodeId = nodeId;
  }

  hasConnectedComponent(): boolean {
    return this.content.connectedComponents?.length > 0;
  }

  hasConnectedComponentAlwaysField(): boolean {
    const connectedComponents = this.content.connectedComponents;
    if (connectedComponents != null && connectedComponents.length > 0) {
      for (const connectedComponent of connectedComponents) {
        if (connectedComponent.fields != null) {
          for (const field of connectedComponent.fields) {
            if (field.when == 'always') {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  isAcceptsAssets(): boolean {
    // TODO: move these to individual component classes when we have them
    return ['ConceptMap', 'Discussion', 'Draw', 'Label', 'Table'].includes(this.content.type);
  }

  isGradable(): boolean {
    return true;
  }

  getConnectedComponent(nodeId: string, componentId: string): any {
    return this.content.connectedComponents.find(
      (connectedComponent) =>
        connectedComponent.nodeId == nodeId && connectedComponent.componentId == componentId
    );
  }
}
