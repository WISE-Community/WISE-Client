import { Component } from '@angular/core';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { ComponentAuthoring } from '../../../authoringTool/components/component-authoring.component';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import peerChatLogicOptions from './peer-chat-logic-options';

@Component({
  selector: 'peer-chat-authoring',
  templateUrl: './peer-chat-authoring.component.html',
  styleUrls: ['./peer-chat-authoring.component.scss']
})
export class PeerChatAuthoringComponent extends ComponentAuthoring {
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

  getComponents(nodeId: string): any[] {
    return this.ProjectService.getComponents(nodeId);
  }

  isComponentTypeAllowed(componentType: string): boolean {
    return this.allowedComponentTypes.includes(componentType);
  }

  tryUpdateComponentId(object: any, nodeIdFieldName: string, componentIdFieldName: string): void {
    const components = this.ProjectService.getComponents(object[nodeIdFieldName]);
    if (components.length === 0) {
      delete object[componentIdFieldName];
    } else if (components.length === 1) {
      object[componentIdFieldName] = components[0].id;
    }
  }

  deleteLogic(index: number): void {
    if (this.authoringComponentContent.logic.length === 1) {
      alert(
        $localize`You are not allowed to delete this Grouping Logic because you must have at least one.`
      );
    } else if (confirm($localize`Are you sure you want to delete this Grouping Logic?`)) {
      this.authoringComponentContent.logic.splice(index, 1);
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

  addQuestion(): void {
    this.authoringComponentContent.questionBank.push('');
    this.componentChanged();
  }

  deleteQuestion(index: number): void {
    this.confirmAndRemove(
      $localize`Are you sure you want to delete this question?`,
      this.authoringComponentContent.questionBank,
      index
    );
  }

  customTrackBy(index: number): number {
    return index;
  }
}
