import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';

@Component({
  selector: 'show-my-work-authoring',
  templateUrl: './show-my-work-authoring.component.html',
  imports: [EditComponentPrompt, MatFormFieldModule, MatSelectModule, FormsModule]
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
