import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ConfigService } from '../../../services/configService';

@Component({
  selector: 'select-step-and-component-checkboxes',
  templateUrl: './select-step-and-component-checkboxes.component.html',
  styleUrls: ['./select-step-and-component-checkboxes.component.scss']
})
export class SelectStepAndComponentCheckboxesComponent {
  protected nodeIdToPositionAndTitle: any = {};
  @Input() nodes: any[] = [];
  @Input() projectIdToOrder: any;

  constructor(public configService: ConfigService, public projectService: TeacherProjectService) {}

  ngOnInit(): void {
    for (const node of this.nodes) {
      const nodeId = node.node.id;
      const position = this.getNodePositionById(nodeId);
      const title = this.getNodeTitleByNodeId(nodeId);
      this.nodeIdToPositionAndTitle[nodeId] = `${position}: ${title}`;
    }
  }

  protected nodeItemClicked(nodeItem: any): void {
    if (nodeItem.node != null) {
      var node = nodeItem.node;
      if (node.ids != null) {
        for (var n = 0; n < node.ids.length; n++) {
          var nodeId = node.ids[n];
          var childNodeItem = this.projectIdToOrder[nodeId];
          childNodeItem.checked = nodeItem.checked;
          var components = childNodeItem.node.components;
          if (components != null) {
            for (var c = 0; c < components.length; c++) {
              components[c].checked = nodeItem.checked;
            }
          }
        }
      } else if (node.components != null) {
        if (nodeItem.checked) {
          if (
            nodeItem.node != null &&
            nodeItem.node.components != null &&
            nodeItem.node.components.length > 0
          ) {
            nodeItem.node.components.map((componentItem) => {
              componentItem.checked = true;
            });
          }
        } else {
          if (
            nodeItem.node != null &&
            nodeItem.node.components != null &&
            nodeItem.node.components.length > 0
          ) {
            nodeItem.node.components.map((componentItem) => {
              componentItem.checked = false;
            });
          }
        }
      }
    }
  }

  protected isNodeInAnyBranchPath(nodeId: string): boolean {
    return this.projectService.isNodeInAnyBranchPath(nodeId);
  }

  protected getNodePositionById(nodeId: string): string {
    return this.projectService.getNodePositionById(nodeId);
  }

  protected getNodeTitleByNodeId(nodeId: string): string {
    return this.projectService.getNodeTitle(nodeId);
  }

  protected previewNode(node: any): void {
    window.open(`${this.configService.getConfigParam('previewProjectURL')}/${node.id}`);
  }
}
