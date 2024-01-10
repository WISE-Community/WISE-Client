'use strict';

import { Component } from '@angular/core';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { ComponentAuthoring } from '../../../authoringTool/components/component-authoring.component';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';
import { ConceptMapService } from '../conceptMapService';

@Component({
  selector: 'concept-map-authoring',
  templateUrl: 'concept-map-authoring.component.html',
  styleUrls: ['concept-map-authoring.component.scss']
})
export class ConceptMapAuthoring extends ComponentAuthoring {
  availableNodes: any[];
  availableLinks: any[];

  constructor(
    private ConceptMapService: ConceptMapService,
    protected ConfigService: ConfigService,
    protected NodeService: NodeService,
    protected ProjectAssetService: ProjectAssetService,
    protected ProjectService: TeacherProjectService,
    protected UtilService: UtilService
  ) {
    super(ConfigService, NodeService, ProjectAssetService, ProjectService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.availableNodes = this.componentContent.nodes;
    this.availableLinks = this.componentContent.links;
    if (this.componentContent.showNodeLabels == null) {
      this.componentContent.showNodeLabels = true;
      this.componentContent.showNodeLabels = true;
    }
  }

  nodeDeleteButtonClicked(index: number): void {
    const nodes = this.componentContent.nodes;
    const node = nodes[index];
    const nodeFileName = node.fileName;
    const nodeLabel = node.label;
    if (
      confirm(
        $localize`Are you sure you want to delete this node?\n\nFile Name: ${nodeFileName}\nLabel: ${nodeLabel}`
      )
    ) {
      nodes.splice(index, 1);
      this.componentChanged();
    }
  }

  linkDeleteButtonClicked(index: number): void {
    const links = this.componentContent.links;
    const link = links[index];
    const linkLabel = link.label;
    if (confirm($localize`Are you sure you want to delete this link?\n\nLabel: ${linkLabel}`)) {
      links.splice(index, 1);
      this.componentChanged();
    }
  }

  addNode(): void {
    const newNode = {
      id: this.getNewConceptMapNodeId(),
      label: '',
      fileName: '',
      width: 100,
      height: 100
    };
    this.componentContent.nodes.push(newNode);
    this.componentChanged();
  }

  getNodeById(nodeId: number): any {
    for (const node of this.componentContent.nodes) {
      if (nodeId === node.id) {
        return node;
      }
    }
    return null;
  }

  addLink(): void {
    const newLink = {
      id: this.getNewConceptMapLinkId(),
      label: '',
      color: ''
    };
    this.componentContent.links.push(newLink);
    this.componentChanged();
  }

  getNewConceptMapNodeId(): string {
    return this.ConceptMapService.getNextAvailableId(this.componentContent.nodes, 'node');
  }

  getNewConceptMapLinkId(): string {
    return this.ConceptMapService.getNextAvailableId(this.componentContent.links, 'link');
  }

  saveStarterState(starterState: any): void {
    this.componentContent.starterConceptMap = starterState;
    this.componentChanged();
  }

  deleteStarterState(): void {
    this.componentContent.starterConceptMap = null;
    this.componentChanged();
  }

  assetSelected(args: any): void {
    super.assetSelected(args);
    const fileName = args.assetItem.fileName;
    if (args.target === 'background') {
      this.componentContent.background = fileName;
      this.componentChanged();
    } else if (args.target != null && args.target.indexOf('node') == 0) {
      const node = this.getNodeById(args.target);
      node.fileName = fileName;
      this.componentChanged();
    }
  }
}
