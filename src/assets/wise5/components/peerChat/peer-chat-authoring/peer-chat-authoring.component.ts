import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { ComponentAuthoring } from '../../../authoringTool/components/component-authoring.component';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';

@Component({
  selector: 'peer-chat-authoring',
  templateUrl: './peer-chat-authoring.component.html',
  styleUrls: ['./peer-chat-authoring.component.scss']
})
export class PeerChatAuthoringComponent extends ComponentAuthoring {
  allowedShowWorkComponentTypes: string[] = [
    'ConceptMap',
    'Draw',
    'Graph',
    'Label',
    'Match',
    'MultipleChoice',
    'OpenResponse',
    'Table'
  ];
  inputChange: Subject<string> = new Subject<string>();
  logicOptions = [
    {
      value: 'random',
      text: $localize`Random`
    },
    {
      value: 'maximizeSimilarIdeas',
      text: $localize`Maximize Similar Ideas`
    },
    {
      value: 'maximizeDifferentIdeas',
      text: $localize`Maximize Different Ideas`
    },
    {
      value: 'manual',
      text: $localize`Manual`
    }
  ];
  nodeIds: string[];

  constructor(
    protected ConfigService: ConfigService,
    protected NodeService: NodeService,
    protected ProjectAssetService: ProjectAssetService,
    protected ProjectService: TeacherProjectService,
    private UtilService: UtilService
  ) {
    super(ConfigService, NodeService, ProjectAssetService, ProjectService);
    this.subscriptions.add(
      this.inputChange.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.componentChanged();
      })
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.nodeIds = this.ProjectService.getFlattenedProjectAsNodeIds();
  }

  isApplicationNode(nodeId: string): boolean {
    return this.ProjectService.isApplicationNode(nodeId);
  }

  getNodePositionAndTitleByNodeId(nodeId: string): string {
    return this.ProjectService.getNodePositionAndTitleByNodeId(nodeId);
  }

  getComponentsByNodeId(nodeId: string): any[] {
    return this.ProjectService.getComponentsByNodeId(nodeId);
  }

  isShowWorkComponentTypeAllowed(componentType: string): boolean {
    return this.allowedShowWorkComponentTypes.includes(componentType);
  }

  showWorkNodeIdChanged(): void {
    this.tryUpdateComponentId(
      this.authoringComponentContent,
      'showWorkNodeId',
      'showWorkComponentId'
    );
    this.componentChanged();
  }

  tryUpdateComponentId(object: any, nodeIdFieldName: string, componentIdFieldName: string): void {
    const components = this.ProjectService.getComponentsByNodeId(object[nodeIdFieldName]);
    if (components.length === 0) {
      delete object[componentIdFieldName];
    } else if (components.length === 1) {
      object[componentIdFieldName] = components[0].id;
    }
  }

  addLogic(): void {
    this.authoringComponentContent.logic.push({ name: 'random' });
    this.componentChanged();
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

  moveQuestionUp(index: number): void {
    this.UtilService.moveObjectUp(this.authoringComponentContent.questionBank, index);
    this.componentChanged();
  }

  moveQuestionDown(index: number): void {
    this.UtilService.moveObjectDown(this.authoringComponentContent.questionBank, index);
    this.componentChanged();
  }

  deleteQuestion(index: number): void {
    if (confirm($localize`Are you sure you want to delete this question?`)) {
      this.authoringComponentContent.questionBank.splice(index, 1);
      this.componentChanged();
    }
  }

  customTrackBy(index: number): any {
    return index;
  }
}
