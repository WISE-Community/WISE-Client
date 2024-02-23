import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ConfigService } from '../../../services/configService';

@Component({
  selector: 'select-step-and-component-checkboxes',
  templateUrl: './select-step-and-component-checkboxes.component.html',
  styleUrls: ['./select-step-and-component-checkboxes.component.scss']
})
export class SelectStepAndComponentCheckboxesComponent {
  @Input() exportStepSelectionType: string = 'exportAllSteps';
  @Output() exportStepSelectionTypeChange: EventEmitter<string> = new EventEmitter<string>();
  protected nodeIdToPositionAndTitle: any = {};
  @Input() nodes: any[] = [];
  protected project: any;
  @Input() projectIdToOrder: any;

  constructor(public configService: ConfigService, public projectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.project = this.projectService.project;
    for (const node of this.nodes) {
      const nodeId = node.node.id;
      const position = this.getNodePositionById(nodeId);
      const title = this.getNodeTitleByNodeId(nodeId);
      this.nodeIdToPositionAndTitle[nodeId] = `${position}: ${title}`;
    }
  }

  protected previewProject(): void {
    window.open(`${this.configService.getConfigParam('previewProjectURL')}`);
  }

  protected selectAll(doSelect: boolean = true): void {
    if (this.projectIdToOrder != null) {
      for (let nodeId in this.projectIdToOrder) {
        let projectItem = this.projectIdToOrder[nodeId];
        if (projectItem.order != 0) {
          projectItem.checked = doSelect;
          if (projectItem.node.type != 'group') {
            if (
              projectItem.node != null &&
              projectItem.node.components != null &&
              projectItem.node.components.length > 0
            ) {
              projectItem.node.components.map((componentItem) => {
                componentItem.checked = doSelect;
              });
            }
          }
        }
      }
    }
  }

  protected deselectAll(): void {
    this.selectAll(false);
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
