import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexModule } from '@angular/flex-layout/flex';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { ConfigService } from '../../../services/configService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  selector: 'show-my-work-authoring',
  templateUrl: './show-my-work-authoring.component.html',
  imports: [
    CommonModule,
    EditComponentPrompt,
    FlexModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ]
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
