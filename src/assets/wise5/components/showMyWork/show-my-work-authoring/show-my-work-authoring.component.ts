import { Component } from '@angular/core';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { ComponentAuthoring } from '../../../authoringTool/components/component-authoring.component';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  selector: 'show-my-work-authoring',
  templateUrl: './show-my-work-authoring.component.html',
  styleUrls: ['./show-my-work-authoring.component.scss']
})
export class ShowMyWorkAuthoringComponent extends ComponentAuthoring {
  allowedShowWorkComponentTypes: string[] = [
    'Animation',
    'AudioOscillator',
    'ConceptMap',
    'DialogGuidance',
    'Discussion',
    'Draw',
    'Graph',
    'Label',
    'Match',
    'MultipleChoice',
    'OpenResponse',
    'PeerChat',
    'Table'
  ];
  nodeIds: string[];

  constructor(
    protected configService: ConfigService,
    protected nodeService: NodeService,
    protected projectAssetService: ProjectAssetService,
    protected projectService: TeacherProjectService
  ) {
    super(configService, nodeService, projectAssetService, projectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.nodeIds = this.ProjectService.getFlattenedProjectAsNodeIds();
  }

  isApplicationNode(nodeId: string): boolean {
    return this.ProjectService.isApplicationNode(nodeId);
  }

  getNodePositionAndTitle(nodeId: string): string {
    return this.ProjectService.getNodePositionAndTitle(nodeId);
  }

  isShowWorkComponentTypeAllowed(componentType: string): boolean {
    return this.allowedShowWorkComponentTypes.includes(componentType);
  }

  showWorkNodeIdChanged(): void {
    const components = this.projectService.getComponents(this.componentContent.showWorkNodeId);
    if (components.length === 1 && this.isAllowedShowWorkComponent(components[0])) {
      this.componentContent.showWorkComponentId = components[0].id;
    } else {
      this.componentContent.showWorkComponentId = '';
    }
    this.componentChanged();
  }

  isAllowedShowWorkComponent(component: any): boolean {
    return this.isShowWorkComponentTypeAllowed(component.type) && component.id != this.componentId;
  }
}
