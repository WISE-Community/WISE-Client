import { Component } from '@angular/core';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherNodeService } from '../../../services/teacherNodeService';

@Component({
  selector: 'show-my-work-authoring',
  templateUrl: './show-my-work-authoring.component.html',
  styleUrls: ['./show-my-work-authoring.component.scss']
})
export class ShowMyWorkAuthoringComponent extends AbstractComponentAuthoring {
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
    protected nodeService: TeacherNodeService,
    protected projectAssetService: ProjectAssetService,
    protected projectService: TeacherProjectService
  ) {
    super(configService, nodeService, projectAssetService, projectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.nodeIds = this.projectService.getFlattenedProjectAsNodeIds();
  }

  isApplicationNode(nodeId: string): boolean {
    return this.projectService.isApplicationNode(nodeId);
  }

  getNodePositionAndTitle(nodeId: string): string {
    return this.projectService.getNodePositionAndTitle(nodeId);
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
