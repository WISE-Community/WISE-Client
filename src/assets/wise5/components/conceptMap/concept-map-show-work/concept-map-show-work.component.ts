import SVG from 'svg.js';
import { Component } from '@angular/core';
import { ProjectService } from '../../../services/projectService';
import { ConceptMapService } from '../conceptMapService';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { NodeService } from '../../../services/nodeService';

@Component({
  selector: 'concept-map-show-work',
  templateUrl: 'concept-map-show-work.component.html',
  styleUrls: ['concept-map-show-work.component.scss']
})
export class ConceptMapShowWorkComponent extends ComponentShowWorkDirective {
  svgId: string;
  draw: any;
  defaultWidth: number = 800;
  defaultHeight: number = 600;
  backgroundImage: string = '';
  backgroundSize: string = '';
  conceptMapNodeIdToNode: any = {};
  nodes: any[] = [];
  links: any[] = [];

  constructor(
    private ConceptMapService: ConceptMapService,
    protected nodeService: NodeService,
    protected ProjectService: ProjectService
  ) {
    super(nodeService, ProjectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.svgId = this.getConceptMapId();
    this.componentState = this.ProjectService.injectAssetPaths(this.componentState);

    /*
     * Call initializeSVG() after a timeout so that angular has a chance to set the svg element id
     * before we start using it. If we don't wait for the timeout, the svg id won't be set when we
     * try to start referencing the svg element.
     */
    setTimeout(() => {
      this.initializeSVG();
    });
  }

  getConceptMapId(): string {
    return this.getConceptMapIdPrefix() + this.componentState.id;
  }

  getConceptMapIdPrefix(): string {
    if (this.isRevision) {
      return 'concept-map-revision-';
    } else {
      return 'concept-map-';
    }
  }

  initializeSVG(): void {
    this.initializeDraw();
    const conceptMapData = this.componentState.studentData.conceptMapData;
    this.populateBackground(conceptMapData);
    this.populateNodes(conceptMapData);
    this.populateLinks(conceptMapData);
    this.moveLinkTextToFront();
    this.moveNodesToFront();
  }

  initializeDraw(): void {
    this.draw = SVG(this.svgId);
    this.draw.width(this.getWidth(this.componentContent));
    this.draw.height(this.getHeight(this.componentContent));
  }

  getWidth(componentContent: any): number {
    if (componentContent.width != null) {
      return componentContent.width;
    }
    return this.defaultWidth;
  }

  getHeight(componentContent: any): number {
    if (componentContent.height != null) {
      return this.componentContent.height;
    }
    return this.defaultHeight;
  }

  populateBackground(conceptMapData: any): void {
    const backgroundPath = this.getBackgroundPath(conceptMapData);
    if (backgroundPath != null) {
      this.setBackgroundPath(backgroundPath);
      this.setBackgroundSize(this.getStretchBackground(conceptMapData));
    }
  }

  getBackgroundPath(conceptMapData: any): string {
    return conceptMapData.backgroundPath;
  }

  getStretchBackground(conceptMapData: any): boolean {
    return conceptMapData.stretchBackground;
  }

  setBackgroundPath(backgroundPath: string): void {
    this.backgroundImage = `url(${backgroundPath})`;
  }

  setBackgroundSize(stretchBackground: boolean): void {
    if (stretchBackground) {
      this.backgroundSize = '100% 100%';
    }
  }

  populateNodes(conceptMapData: any): void {
    for (const node of conceptMapData.nodes) {
      const conceptMapNode = this.ConceptMapService.newConceptMapNode(
        this.draw,
        node.instanceId,
        node.originalId,
        node.fileName,
        node.label,
        node.x,
        node.y,
        node.width,
        node.height,
        this.componentContent.showNodeLabels
      );
      this.nodes.push(conceptMapNode);
      this.conceptMapNodeIdToNode[conceptMapNode.id] = conceptMapNode;
    }
  }

  populateLinks(conceptMapData: any): void {
    for (const link of conceptMapData.links) {
      const sourceNode = this.getSourceNode(link);
      const destinationNode = this.getDestinationNode(link);
      const conceptMapLink = this.ConceptMapService.newConceptMapLink(
        this.draw,
        link.instanceId,
        link.originalId,
        sourceNode,
        destinationNode,
        link.label,
        link.color,
        link.curvature,
        link.startCurveUp,
        link.endCurveUp
      );
      this.links.push(conceptMapLink);
    }
  }

  getSourceNode(link: any): any {
    const sourceNodeId = link.sourceNodeInstanceId;
    if (sourceNodeId != null) {
      return this.getNodeById(sourceNodeId);
    }
    return null;
  }

  getDestinationNode(link: any): any {
    const destinationNodeId = link.destinationNodeInstanceId;
    if (destinationNodeId != null) {
      return this.getNodeById(destinationNodeId);
    }
    return null;
  }

  getNodeById(conceptMapNodeId: string): any {
    return this.conceptMapNodeIdToNode[conceptMapNodeId];
  }

  moveLinkTextToFront(): void {
    this.ConceptMapService.moveLinkTextToFront(this.links);
  }

  moveNodesToFront(): void {
    this.ConceptMapService.moveNodesToFront(this.nodes);
  }
}
