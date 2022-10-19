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
}
