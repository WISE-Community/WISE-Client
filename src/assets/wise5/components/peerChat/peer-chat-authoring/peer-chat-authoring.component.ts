import { Component } from '@angular/core';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import peerChatLogicOptions from './peer-chat-logic-options';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { EditDynamicPromptComponent } from '../../../../../app/authoring-tool/edit-dynamic-prompt/edit-dynamic-prompt.component';
import { EditQuestionBankComponent } from '../../../../../app/authoring-tool/edit-question-bank/edit-question-bank.component';
import { EditComponentPeerGroupingTagComponent } from '../../../../../app/authoring-tool/edit-component-peer-grouping-tag/edit-component-peer-grouping-tag.component';

@Component({
  imports: [
    EditComponentPrompt,
    EditDynamicPromptComponent,
    EditQuestionBankComponent,
    EditComponentPeerGroupingTagComponent
  ],
  styleUrl: './peer-chat-authoring.component.scss',
  templateUrl: './peer-chat-authoring.component.html'
})
export class PeerChatAuthoringComponent extends AbstractComponentAuthoring {
  allowedComponentTypes: string[] = [
    'ConceptMap',
    'Draw',
    'Graph',
    'Label',
    'Match',
    'MultipleChoice',
    'OpenResponse',
    'Table'
  ];
  logicOptions = peerChatLogicOptions;
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

  getComponents(nodeId: string): any[] {
    return this.projectService.getComponents(nodeId);
  }

  isComponentTypeAllowed(componentType: string): boolean {
    return this.allowedComponentTypes.includes(componentType);
  }

  tryUpdateComponentId(object: any, nodeIdFieldName: string, componentIdFieldName: string): void {
    const components = this.projectService.getComponents(object[nodeIdFieldName]);
    if (components.length === 0) {
      delete object[componentIdFieldName];
    } else if (components.length === 1) {
      object[componentIdFieldName] = components[0].id;
    }
  }

  deleteLogic(index: number): void {
    if (this.componentContent.logic.length === 1) {
      alert(
        $localize`You are not allowed to delete this Grouping Logic because you must have at least one.`
      );
    } else if (confirm($localize`Are you sure you want to delete this Grouping Logic?`)) {
      this.componentContent.logic.splice(index, 1);
      this.componentChanged();
    }
  }

  logicNameChanged(logicObject: any): void {
    if (logicObject.name === 'random' || logicObject.name === 'manual') {
      delete logicObject.nodeId;
      delete logicObject.componentId;
    }
    this.componentChanged();
  }

  logicNodeIdChanged(logicObject: any): void {
    this.tryUpdateComponentId(logicObject, 'nodeId', 'componentId');
    this.componentChanged();
  }
}
