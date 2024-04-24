'use strict';

import { Component } from '@angular/core';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ConceptMapService } from '../conceptMapService';
import { MatDialog } from '@angular/material/dialog';
import { AssetChooser } from '../../../authoringTool/project-asset-authoring/asset-chooser';
import { filter } from 'rxjs/operators';
import { TeacherNodeService } from '../../../services/teacherNodeService';

@Component({
  selector: 'concept-map-authoring',
  templateUrl: 'concept-map-authoring.component.html',
  styleUrls: ['concept-map-authoring.component.scss']
})
export class ConceptMapAuthoring extends AbstractComponentAuthoring {
  availableNodes: any[];
  availableLinks: any[];

  constructor(
    private ConceptMapService: ConceptMapService,
    protected ConfigService: ConfigService,
    private dialog: MatDialog,
    protected NodeService: TeacherNodeService,
    protected ProjectAssetService: ProjectAssetService,
    protected ProjectService: TeacherProjectService
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
    if (args.target != null && args.target.indexOf('node') == 0) {
      const node = this.getNodeById(args.target);
      node.fileName = fileName;
      this.componentChanged();
    }
  }

  chooseAsset(target: string): void {
    new AssetChooser(this.dialog, this.nodeId, this.componentId)
      .open(target)
      .afterClosed()
      .pipe(filter((data) => data != null))
      .subscribe((data: any) => {
        return this.assetSelected(data);
      });
  }
}
